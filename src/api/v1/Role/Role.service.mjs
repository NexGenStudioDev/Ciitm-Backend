import RoleConstant from './Role.constant.mjs';
import Admin_Role from './Role.model.mjs';
import AuthenticationSchema from '../Auth/Auth.model.mjs';
import envConstant from '../../../constant/env.constant.mjs';

class Role_Service {
  create_Admin_Role = async (email) => {
    try {
      const Create_Admin = await Admin_Role.create({
        email: email,
      });

      if (!Create_Admin) {
        throw Error(RoleConstant.ROLE_NOT_CREATED);
      }

      return Create_Admin;
    } catch (error) {
      throw new Error(error.message || 'Failed to create Admin Role');
    }
  };

  getAllAdmins = async () => {
    try {
      const defaultEmail = envConstant.ADMIN_EMAIL || 'admin@gmail.com';
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
      adminMap.set(defaultEmail.toLowerCase(), {
        _id: 'root-admin',
        name: 'Super Administrator',
        email: defaultEmail,
        role: 'admin',
        isActive: true,
        createdAt: new Date('2025-01-01'),
      });

      for (const a of authAdmins) {
        if (a?.email) {
          adminMap.set(a.email.toLowerCase(), {
            _id: a._id ? a._id.toString() : `auth-${a.email}`,
            name: a.name || a.email.split('@')[0],
            email: a.email,
            role: a.role || 'admin',
            isActive: a.isActive !== false,
            createdAt: a.createdAt || new Date(),
          });
        }
      }

      for (const r of roleAdmins) {
        if (r?.email && !adminMap.has(r.email.toLowerCase())) {
          adminMap.set(r.email.toLowerCase(), {
            _id: r._id ? r._id.toString() : `role-${r.email}`,
            name: r.email.split('@')[0],
            email: r.email,
            role: 'admin',
            isActive: true,
            createdAt: r.createdAt || new Date(),
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
      const defaultEmail = envConstant.ADMIN_EMAIL || 'admin@gmail.com';
      if (identifier === defaultEmail || identifier === 'root-admin') {
        throw new Error('Root super administrator account cannot be deleted');
      }

      const isObjectId = Boolean(identifier && identifier.match(/^[0-9a-fA-F]{24}$/));

      await Admin_Role.deleteMany({
        $or: [{ email: identifier }, ...(isObjectId ? [{ _id: identifier }] : [])],
      });

      await AuthenticationSchema.deleteMany({
        $or: [{ email: identifier }, ...(isObjectId ? [{ _id: identifier }] : [])],
      });

      return { success: true, message: 'Administrator role revoked successfully' };
    } catch (error) {
      throw new Error(error.message || 'Failed to remove administrator');
    }
  };
}

export default new Role_Service();
