import RoleConstant from './Role.constant.mjs';
import Admin_Role from './Role.model.mjs';
import AuthenticationSchema from '../Auth/Auth.model.mjs';

class Role_Utils {
  Find_Role = async (email) => {
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const Role_Found = await Admin_Role.findOne({ email: cleanEmail });

      if (Role_Found) {
        throw new Error(RoleConstant.ROLE_ALREADY_EXISTS);
      }

      const Auth_Found = await AuthenticationSchema.findOne({
        email: cleanEmail,
        role: 'admin',
      });
      if (Auth_Found) {
        throw new Error(RoleConstant.ROLE_ALREADY_EXISTS);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to find Role');
    }
  };
}

export default new Role_Utils();
