import { Resend } from 'resend';
import envConstant from '../constant/env.constant.mjs';

const resend = new Resend(envConstant.RESEND_API_KEY);

const sendEmail = async ({ email, sub, mess }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: envConstant.FROM_EMAIL,
      to: email,
      subject: sub,
      html: mess,
    });

    if (error) {
      console.error('Error sending email:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

export default sendEmail;