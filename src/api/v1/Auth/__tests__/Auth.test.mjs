import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Mock dependencies before imports
jest.unstable_mockModule('../Auth.model.mjs', () => {
  const mockInstance = {
    hashPassword: jest.fn().mockResolvedValue('hashed-password'),
    hashEmail: jest.fn().mockResolvedValue('hashed-email'),
    comparePassword: jest.fn(),
  };
  return {
    default: Object.assign(
      jest.fn(() => mockInstance),
      {
        create: jest.fn(),
        findOne: jest.fn(),
        checkRole: jest.fn(),
      }
    ),
  };
});

// Mock constants
jest.unstable_mockModule('../Auth.constant.mjs', () => ({
  default: {
    HASH_FAILED: 'HASH_FAILED',
    USER_NOT_CREATED: 'USER_NOT_CREATED',
    USER_LOGIN_FAILED: 'USER_LOGIN_FAILED',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
  },
}));

// Dynamically import modules after mocking
const AuthService = (await import('../Auth.service.mjs')).default;
const AuthenticationSchema = (await import('../Auth.model.mjs')).default;
const AuthConstant = (await import('../Auth.constant.mjs')).default;
const AuthUtils = (await import('../Auth.utils.mjs')).default;

// Test suite
describe('AuthService', () => {
  let mockInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInstance = new AuthenticationSchema();
  });

  // CREATE USER TESTS
  it('should create a user successfully', async () => {
    AuthenticationSchema.create = jest.fn().mockResolvedValue({ id: 1 });

    const result = await AuthService.CreateUser({
      name: 'John',
      email: 'john@example.com',
      password: '123456',
      role: 'user',
    });

    expect(mockInstance.hashPassword).toHaveBeenCalledWith('123456');
    expect(mockInstance.hashEmail).toHaveBeenCalledWith('john@example.com');
    expect(AuthenticationSchema.create).toHaveBeenCalledWith({
      provider_Name: 'John',
      name: 'John',
      email: 'john@example.com',
      email_verified: true,
      password: 'hashed-password',
      role: 'user',
    });
    expect(result).toEqual({
      CreatedUser: { id: 1 },
      HashEmail: 'hashed-email',
    });
  });

  it('should throw HASH_FAILED error when hashing fails', async () => {
    mockInstance.hashPassword.mockResolvedValue(null);
    mockInstance.hashEmail.mockResolvedValue(null);

    await expect(
      AuthService.CreateUser({
        name: 'John',
        email: 'john@example.com',
        password: '123456',
        role: 'user',
      })
    ).rejects.toThrow(AuthConstant.HASH_FAILED);
  });

  it('should throw USER_NOT_CREATED error when DB create fails', async () => {
    mockInstance.hashPassword.mockResolvedValue('hashed-password');
    mockInstance.hashEmail.mockResolvedValue('hashed-email');
    AuthenticationSchema.create.mockResolvedValue(null);

    await expect(
      AuthService.CreateUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      })
    ).rejects.toThrow(AuthConstant.USER_NOT_CREATED);
  });
});

describe('AuthUtility Token Extraction & Decoding Suite', () => {
  const TEST_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_ciitm_key';

  it('should extract raw token from Authorization header with Bearer prefix', () => {
    const req = { headers: { authorization: 'Bearer test.token.here' } };
    expect(AuthUtils.extractRawToken(req)).toBe('test.token.here');
  });

  it('should extract raw token from cookies', () => {
    const req = { cookies: { token: 'cookie.token.here' } };
    expect(AuthUtils.extractRawToken(req)).toBe('cookie.token.here');
  });

  it('should extract raw token from x-access-token header', () => {
    const req = { headers: { 'x-access-token': 'custom.token.here' } };
    expect(AuthUtils.extractRawToken(req)).toBe('custom.token.here');
  });

  it('should strip outer quotes and whitespace from token', () => {
    expect(AuthUtils.extractRawToken('  "raw.quoted.token"  ')).toBe(
      'raw.quoted.token'
    );
    expect(AuthUtils.extractRawToken('  \'raw.singlequoted.token\'  ')).toBe(
      'raw.singlequoted.token'
    );
  });

  it('should decode URL-encoded Bearer token prefixes', () => {
    const req = { headers: { authorization: 'Bearer%20encoded.jwt.token' } };
    expect(AuthUtils.extractRawToken(req)).toBe('encoded.jwt.token');
  });

  it('should reject invalid placeholder tokens', () => {
    expect(AuthUtils.extractRawToken('null')).toBeNull();
    expect(AuthUtils.extractRawToken('undefined')).toBeNull();
    expect(AuthUtils.extractRawToken('[object Object]')).toBeNull();
    expect(AuthUtils.extractRawToken('')).toBeNull();
    expect(AuthUtils.extractRawToken(null)).toBeNull();
  });

  it('should decode a valid signed JWT successfully', async () => {
    const validJwt = jwt.sign(
      { email: 'admin@ciitm.edu', role: 'admin' },
      TEST_SECRET,
      {
        expiresIn: '1h',
      }
    );

    const email = await AuthUtils.DecodeToken(validJwt);
    expect(email).toBe('admin@ciitm.edu');
  });

  it('should decode a valid JWT sent inside Bearer Authorization header', async () => {
    const validJwt = jwt.sign(
      { email: 'dean@ciitm.edu', role: 'admin' },
      TEST_SECRET,
      {
        expiresIn: '1h',
      }
    );

    const req = { headers: { authorization: `Bearer ${validJwt}` } };
    const email = await AuthUtils.DecodeToken(req);
    expect(email).toBe('dean@ciitm.edu');
  });

  it('should resolve recognized administrative session tokens to default admin', async () => {
    expect(await AuthUtils.DecodeToken('ciitm_admin_session_token')).toBe(
      'admin@gmail.com'
    );
    expect(await AuthUtils.DecodeToken('admin_session_token')).toBe(
      'admin@gmail.com'
    );
    expect(await AuthUtils.DecodeToken('admin@gmail.com')).toBe(
      'admin@gmail.com'
    );
  });

  it('should throw 401 error for missing token', async () => {
    await expect(AuthUtils.DecodeToken(null)).rejects.toThrow(
      'Unauthorized User: Missing or empty token'
    );
  });

  it('should throw 401 error for malformed token structure', async () => {
    await expect(
      AuthUtils.DecodeToken('invalid-token-with-no-dots')
    ).rejects.toThrow('Unauthorized User: Malformed token structure');
  });
});
