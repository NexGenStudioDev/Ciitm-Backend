import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import Testimonial from './Testimonial.model.mjs';

class Testimonial_Service {
  Create_Testimonial = async ({ data, file }) => {
    try {
      let { filename } = file;

      let Cloudinary = await uploadOnCloudinary(filename);

      let Created_Testimonial = await Testimonial.create({
        name: data.name,
        email: data.email,
        image: Cloudinary?.url,
        message: data.message,
        job_Role: data.job_Role,
        star: data.star,
      });

      if (!Created_Testimonial) {
        throw new Error('Failed to Create Testimonial');
      }

      return Created_Testimonial;
    } catch (error) {
      throw new Error(error.message || 'Failed to Find Course');
    }
  };

  Find_Testimonial_Controller = async (req, res) => {
    try {
      let Find_Testimonial = await Testimonial.find();

      if (!Find_Testimonial) {
        return res.status(404).json({
          message: 'No testimonials found',
          error: true,
        });
      }

      return res.status(200).json({
        message: 'testimonials found',
        Find_Testimonial,
        found: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || 'Failed to find testimonials',
        error: true,
      });
    }
  };
}

export default new Testimonial_Service();
