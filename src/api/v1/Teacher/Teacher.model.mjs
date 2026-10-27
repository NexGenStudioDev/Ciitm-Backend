import { Schema, model } from 'mongoose';

let Teacher_Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },

    Specialization: {
      type: String,
      required: true,
    },

    Experience: {
      type: Number,
      default: 0,
      required: true,
    },

    social_media: [
      {
        facebook: {
          type: String,
          default: '#',
        },
        linkedin: {
          type: String,
          default: '#',
        },
        twitter: {
          type: String,
          default: '#',
        },
        instagram: {
          type: String,
          default: '#',
        },
      },
    ],
  },
  { timestamps: true }
);

let TeacherSchema = model('Teacher', Teacher_Schema);
export default TeacherSchema;
