import { model, Schema } from 'mongoose';

const Admin_Role_Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      default: 'admin',
    },
    designation: {
      type: String,
      default: 'Campus Administrator',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Admin_Role = model('Admin_Role', Admin_Role_Schema);
export default Admin_Role;
