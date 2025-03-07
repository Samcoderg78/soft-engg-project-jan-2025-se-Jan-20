const request = require('supertest');
const {app} = require('../../app');

describe('User Login API Tests', () => {
  // First create a test user that we'll use for login tests
  const testUser = {
    name: 'Login Test User',
    email: 'logintest@example.com',
    password: 'password123',
    roll_no: 'R123',
    role: 'student'
  };

  beforeAll(async () => {
    // Register a user before running login tests
    await request(app)
      .post('/api/user/add-user')
      .send(testUser);
  });

  describe('POST /api/v1/education/login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeTruthy();
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('name', testUser.name);
      expect(response.body.user).toHaveProperty('role', testUser.role);
    });

    it('should fail login when email is missing', async () => {
      const loginWithoutEmail = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(loginWithoutEmail)
        .expect(400);

      expect(response.body.message).toBe('Email and password are required');
      expect(response.body.data).toBe("");
    });

    it('should fail login when password is missing', async () => {
      const loginWithoutPassword = {
        email: testUser.email
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(loginWithoutPassword)
        .expect(400);

      expect(response.body.message).toBe('Email and password are required');
      expect(response.body.data).toBe("");
    });

    it('should fail login with incorrect password', async () => {
      const wrongPasswordLogin = {
        email: testUser.email,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(wrongPasswordLogin)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail login with non-existent email', async () => {
      const nonExistentLogin = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(nonExistentLogin)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail login with empty string fields', async () => {
      const emptyFieldsLogin = {
        email: '',
        password: ''
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(emptyFieldsLogin)
        .expect(400);

      expect(response.body.message).toBe('Email and password are required');
      expect(response.body.data).toBe("");
    });

    it('should handle login with extra unknown fields', async () => {
      const loginWithExtraFields = {
        email: testUser.email,
        password: testUser.password,
        extraField: 'some value',
        anotherField: { key: 'value' }
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(loginWithExtraFields)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should verify JWT token is valid', async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(loginData)
        .expect(200);

      expect(response.body.token).toBeTruthy();
      // Verify token structure (should be a string with three parts separated by dots)
      expect(response.body.token.split('.')).toHaveLength(3);
    });
  });
}); 