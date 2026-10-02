import Authentication from './Auth.model.mjs';
import jwt from 'jsonwebtoken';
import env_Constant from '../../../constant/env.constant.mjs';
import { SignUp_Validator } from './Auth.validator.mjs';

class AuthUtility {
  async SignUP_Validator({ name, email, password, confirm_Password }) {
    try {
      let { error } = SignUp_Validator.validate({
        name: name,
        email: email,
        password: password,
        confirm_Password: confirm_Password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  extractRawToken(input) {
    if (!input) return null;
    let token = '';

    if (typeof input === 'string') {
      token = input;
    } else if (typeof input === 'object') {
      token =
        input.cookies?.token ||
        input.headers?.authorization ||
        input.headers?.Authorization ||
        input.headers?.['x-access-token'] ||
        input.headers?.['token'] ||
        input.query?.token ||
        '';
    }

    if (!token || typeof token !== 'string') return null;

    token = token.trim();

    // Strip wrapping quotes if any
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      token = token.slice(1, -1).trim();
    }

    // Strip Bearer prefix (case-insensitive)
    if (/^bearer\s+/i.test(token)) {
      token = token.replace(/^bearer\s+/i, '').trim();
    }

    // Guard against literal placeholder strings
    if (
      !token ||
      token === 'undefined' ||
      token === 'null' ||
      token === '[object Object]'
    ) {
      return null;
    }

    return token;
  }

  DecodeToken = async (tokenOrReq) => {
    const token = this.extractRawToken(tokenOrReq);

    if (!token) {
      const err = new Error('Unauthorized User: Missing or empty token');
      err.status = 401;
      err.statusCode = 401;
      throw err;
    }

    // Fast-path JWT format validation: JWT consists of 3 dot-separated Base64 segments
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      const err = new Error('Unauthorized User: Malformed token structure');
      err.status = 401;
      err.statusCode = 401;
      throw err;
    }

    try {
      const secret =
        env_Constant.JWT_SECRET ||
        process.env.JWT_SECRET ||
        'dev_secret_ciitm_jwt_token_2026';

      const decoded = jwt.verify(token, secret);

      if (!decoded || !decoded.email) {
        const err = new Error('Unauthorized User: Missing email in token');
        err.status = 401;
        err.statusCode = 401;
        throw err;
      }
      return decoded.email;
    } catch (error) {
      if (error.status === 401 || error.statusCode === 401) {
        throw error;
      }
      const message =
        error.name === 'TokenExpiredError'
          ? 'Unauthorized User: Token has expired'
          : error.name === 'JsonWebTokenError'
          ? 'Unauthorized User: Invalid or malformed token'
          : `Unauthorized User: ${error.message}`;

      const err = new Error(message);
      err.status = 401;
      err.statusCode = 401;
      err.originalError = error.message;
      throw err;
    }
  };

  FindByEmail = async (email) => {
    return Authentication.findOne({ email: email });
  };
}

export default new AuthUtility();
