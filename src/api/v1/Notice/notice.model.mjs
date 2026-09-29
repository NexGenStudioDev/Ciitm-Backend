import { Schema, model } from 'mongoose';

const noticeSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
  },
  dateIssued: {
    type: Date,
    default: Date.now,
  },

  doc_link: {
    type: String,
    required: true,
  },

  expiryDate: {
    type: Date,
    default: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000),
  },

  type: {
    type: String,
    required: true,
    enum: ['Event', 'Holiday', 'Announcement', 'General'],
    default: 'General',
  },
});

const Notice = model('Notice', noticeSchema);

export default Notice;
