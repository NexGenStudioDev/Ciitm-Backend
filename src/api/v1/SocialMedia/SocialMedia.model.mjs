import { Schema, model } from 'mongoose';

const SocialMediaSchema = new Schema({
  linkedin: { type: String, trim: true },
  facebook: { type: String, trim: true },
  instagram: { type: String, trim: true },
  email: { type: String, trim: true },
  number: { type: Number, min: 0, max: 9999999999 },
});

const SocialMedia = model('socialMedia', SocialMediaSchema);
export default SocialMedia;
