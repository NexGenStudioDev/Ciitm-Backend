import Authentication from '../api/v1/Auth/Auth.model.mjs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createTransport } from '../utils/SendMail.js';
import dotenv from 'dotenv';
import AuthUtils from '../api/v1/Auth/Auth.utils.mjs';
dotenv.config();

export let ForgotPassword_Controller = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    let findUser = await Authentication.findOne({ email: email });

    if (!findUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    let otp = crypto.randomBytes(3).toString('hex');
    let hashedOtp = await bcrypt.hash(otp, 10);

    res.cookie('otp', hashedOtp, { httpOnly: true, secure: true });

    let transporter = createTransport();

    let mailOptions = {
      from: process.env.GMAIL_User,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email', error });
      } else {
        return res.status(200).json({ message: 'OTP sent to email' });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export let ResetPassword_Controller = async (req, res) => {
  try {
    let { otp, new_Password } = req.body;
    let { otp: hashedOtp } = req.cookies;

    if (!otp || !new_Password) {
      return res
        .status(400)
        .json({ message: 'OTP and new password are required' });
    }

    if (!hashedOtp) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    let isOtpValid = await bcrypt.compare(otp, hashedOtp);

    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    let email = await AuthUtils.DecodeToken(req.cookies.token);
    let hashedPassword = await bcrypt.hash(new_Password, 10);

    await Authentication.updateOne(
      { email: email },
      { password: hashedPassword }
    );

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};
