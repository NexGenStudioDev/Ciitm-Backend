import Authentication from '../api/v1/Auth/Auth.model.mjs';
import AuthUtils from '../api/v1/Auth/Auth.utils.mjs';

export let Profile_Controller = async (req, res) => {
  try {
    let { token } = req.cookies;
    let email = await AuthUtils.DecodeToken(token);

    if (!email) {
      return res.status(403).json({
        message: 'Bad Request: Email Not Found',
        admin: false,
        Unauthorized: true,
        error: true,
      });
    }

    let findUser = await Authentication.findOne({ email: email });

    if (!findUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User found',
      findUser,
    });
  } catch (error) {}
};
