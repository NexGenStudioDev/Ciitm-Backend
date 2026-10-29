import RoleConstant from './Role.constant.mjs';
import Admin_Role from './Role.model.mjs';
import AuthenticationSchema from '../Auth/Auth.model.mjs';
import envConstant from '../../../constant/env.constant.mjs';

class Role_Service {
  create_Admin_Role = async (data) => {
    try {
      const email = (typeof data === 'string' ? data : data.email || '').trim().toLowerCase();
      if (!email) {
        throw new Error('Email is required to create Admin Role');
      }

      const name = (typeof data === 'object' && data.name ? data.name : email.split('@')[0]).trim();
      const password = (typeof data === 'object' && data.password ? data.password : 'Admin@123').trim();
      const role = (typeof data === 'object' && data.role ? data.role : 'admin').trim();
      const designation = (typeof data === 'object' && data.designation ? data.designation : 'Campus Administrator').trim();

      // 1. Create or update in Admin_Role
      let roleRecord = await Admin_Role.findOne({ email });
      if (roleRecord) {
        roleRecord.name = name;
        roleRecord.role = role;
        roleRecord.designation = designation;
        roleRecord.isActive = true;
        await roleRecord.save();
      } else {
        roleRecord = await Admin_Role.create({
          email,
          name,
          role,
          designation,
          isActive: true,
        });
      }

      // 2. Also ensure AuthenticationSchema user exists with hashed password so they can log in
      let authUser = await AuthenticationSchema.findOne({ email });
      if (!authUser) {
        const AuthInstance = new AuthenticationSchema();
        const hash = await AuthInstance.hashPassword(password);
        authUser = await AuthenticationSchema.create({
          provider_Name: name,
          name,
          email,
          email_verified: true,
          password: hash,
          role: 'admin',
        });
      } else {
        if (authUser.role !== 'admin') {
          authUser.role = 'admin';
          await authUser.save();
        }
      }

      return roleRecord;
    } catch (error) {
      throw new Error(error.message || 'Failed to create Admin Role');
    }
  };

  getAllAdmins = async () => {
    try {
      const defaultEmail = (envConstant.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
      let authAdmins = [];
      try {
        authAdmins = await AuthenticationSchema.find(
          { role: 'admin' },
          '-password'
        ).lean();
      } catch {
        authAdmins = [];
      }

      let roleAdmins = [];
      try {
        roleAdmins = await Admin_Role.find({}).lean();
      } catch {
        roleAdmins = [];
      }

      const adminMap = new Map();

      // Ensure root super admin is always present
      adminMap.set(defaultEmail, {
        _id: 'root-admin',
        name: 'Super Administrator',
        email: defaultEmail,
        role: 'admin',
        designation: 'Chief Administrative Officer',
        isActive: true,
        createdAt: new Date('2025-01-01'),
      });

      for (const a of authAdmins) {
        if (a?.email) {
          const emailKey = a.email.toLowerCase();
          adminMap.set(emailKey, {
            _id: a._id ? a._id.toString() : `auth-${a.email}`,
            name: a.name || a.email.split('@')[0],
            email: a.email,
            role: a.role || 'admin',
            designation: 'Institutional Administrator',
            isActive: a.isActive !== false,
            createdAt: a.createdAt || new Date(),
          });
        }
      }

      for (const r of roleAdmins) {
        if (r?.email) {
          const emailKey = r.email.toLowerCase();
          const existing = adminMap.get(emailKey) || {};
          adminMap.set(emailKey, {
            ...existing,
            _id: r._id ? r._id.toString() : existing._id || `role-${r.email}`,
            name: r.name || existing.name || r.email.split('@')[0],
            email: r.email,
            role: r.role || existing.role || 'admin',
            designation: r.designation || existing.designation || 'Campus Administrator',
            isActive: r.isActive !== false,
            createdAt: r.createdAt || existing.createdAt || new Date(),
          });
        }
      }

      return Array.from(adminMap.values());
    } catch (error) {
      throw new Error(error.message || 'Failed to retrieve administrators');
    }
  };

  deleteAdmin = async (identifier) => {
    try {
      const defaultEmail = (envConstant.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
      const target = (identifier || '').toString().trim().toLowerCase();

      if (target === defaultEmail || target === 'root-admin') {
        throw new Error('Root super administrator account cannot be deleted');
      }

      const isObjectId = Boolean(identifier && identifier.match(/^[0-9a-fA-F]{24}$/));

      await Admin_Role.deleteMany({
        $or: [
          { email: target },
          ...(isObjectId ? [{ _id: identifier }] : []),
        ],
      });

      await AuthenticationSchema.deleteMany({
        $or: [
          { email: target },
          ...(isObjectId ? [{ _id: identifier }] : []),
        ],
      });

      return { success: true, message: 'Administrator role revoked successfully' };
    } catch (error) {
      throw new Error(error.message || 'Failed to remove administrator');
    }
  };
}

export default new Role_Service();
