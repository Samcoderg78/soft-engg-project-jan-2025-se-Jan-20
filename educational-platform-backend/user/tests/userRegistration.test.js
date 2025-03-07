const request = require('supertest');
const {app} = require('../../app');

describe('User Registration API Tests', () => {
  describe('POST /api/user/add-user', () => {
    it('should successfully register a new user with all valid fields', async () => {
      const validUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        roll_no: 'R123',
        role: 'student'
      };

      const response = await request(app)
        .post('/api/user/add-user')
        .send(validUser)
        .expect(201);

      expect(response.body.message).toBe('User created successfully!');
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data).toHaveProperty('name', validUser.name);
      expect(response.body.data).toHaveProperty('email', validUser.email);
      expect(response.body.data).toHaveProperty('roll_no', validUser.roll_no);
      expect(response.body.data).toHaveProperty('role', validUser.role);
    });

   
    it('should fail registration when name is missing', async () => {
      const userWithoutName = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/user/add-user')
        .send(userWithoutName)
        .expect(400);

      expect(response.body.message).toBe('Missing required fields');
      expect(response.body.data).toBe("");
    });

    it('should fail registration when email is missing', async () => {
      const userWithoutEmail = {
        name: 'Test User',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/user/add-user')
        .send(userWithoutEmail)
        .expect(400);

      expect(response.body.message).toBe('Missing required fields');
      expect(response.body.data).toBe("");
    });

    it('should fail registration when password is missing', async () => {
      const userWithoutPassword = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/user/add-user')
        .send(userWithoutPassword)
        .expect(400);

      expect(response.body.message).toBe('Missing required fields');
      expect(response.body.data).toBe("");
    });

    it('should fail registration with empty string fields', async () => {
      const emptyFieldsUser = {
        name: '',
        email: '',
        password: ''
      };

      const response = await request(app)
        .post('/api/user/add-user')
        .send(emptyFieldsUser)
        .expect(400);

      expect(response.body.message).toBe('Missing required fields');
      expect(response.body.data).toBe("");
    });


    it('should handle registration with extra unknown fields', async () => {
      const userWithExtraFields = {
        name: 'Extra Fields User',
        email: 'extra@example.com',
        password: 'password123',
        unknownField: 'some value',
        extraData: { key: 'value' }
      };

      const response = await request(app)
        .post('/api/user/add-user')
        .send(userWithExtraFields)
        .expect(201);

      expect(response.body.message).toBe('User created successfully!');
      expect(response.body.data).not.toHaveProperty('unknownField');
      expect(response.body.data).not.toHaveProperty('extraData');
    });

  });
});