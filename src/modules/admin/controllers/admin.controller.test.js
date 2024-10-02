import { describe, test, expect } from '@jest/globals';
import request from 'supertest';

import app from '../../../app.js';

describe('Test suit for AdminController', () => {
  describe('/admin/best-profession', () => {
    test('should be able to get best profession with no filter', async () => {
      const response = await request(app)
        .get('/admin/best-profession');

      expect(response.status).toBe(200);
      expect(response.body.data).toStrictEqual([
        { totalPaid: 200, profession: 'Fighter' },
        { totalPaid: 221, profession: 'Musician' },
        { totalPaid: 2683, profession: 'Programmer' }
      ]);
    });

    test('should be able to get best profession with date filter', async () => {
      const response = await request(app)
        .get('/admin/best-profession?start=2020-08-09&end=2020-08-15');

      expect(response.status).toBe(200);
      expect(response.body.data).toStrictEqual([
        { totalPaid: 21, profession: 'Musician' },
        { totalPaid: 121, profession: 'Programmer' }
      ]);
    });
  });

  describe('/admin/best-clients', () => {
    test('should be able to get all best clients with no filter and limit default', async () => {
      const response = await request(app)
        .get('/admin/best-clients');

      expect(response.status).toBe(200);
      expect(response.body.data).toStrictEqual([
        { paid: 2020, id: 4, fullName: 'Ash Kethcum' },
        { paid: 442, id: 2, fullName: 'Mr Robot' }
      ]);
    });

    test('should be able to get all best clients with date filter and limit default', async () => {
      const response = await request(app)
        .get('/admin/best-clients?start=2020-08-09&end=2020-08-15');

      expect(response.status).toBe(200);

      expect(response.body.data).toStrictEqual([
        { paid: 121, id: 2, fullName: 'Mr Robot' },
        { paid: 21, id: 1, fullName: 'Harry Potter' }
      ]);
    });

    test('should be able to get all best clients with user chosen limit', async () => {
      const response = await request(app)
        .get('/admin/best-clients?limit=10');

      expect(response.status).toBe(200);

      expect(response.body.data).toStrictEqual([
        { paid: 2020, id: 4, fullName: 'Ash Kethcum' },
        { paid: 442, id: 2, fullName: 'Mr Robot' },
        { paid: 442, id: 1, fullName: 'Harry Potter' },
        { paid: 200, id: 3, fullName: 'John Snow' }
      ]);
    });

    test('should be able to get all best clients with user chosen limit and date filter', async () => {
      const response = await request(app)
        .get('/admin/best-clients?start=2020-08-09&end=2020-08-15&limit=1');

      expect(response.status).toBe(200);

      expect(response.body.data).toStrictEqual([
        { paid: 121, id: 2, fullName: 'Mr Robot' },
      ]);
    });
  });

  describe('/admin/profile/:id', () => {
    test('should be able to get a user by id', async () => {
      const userId = 1;

      const userResponse = await request(app)
        .get(`/admin/profile/${userId}`);

      expect(userResponse.status).toBe(200);
      expect(userResponse.body.data.firstName).toBe('Harry');
      expect(userResponse.body.data.lastName).toBe('Potter');
      expect(userResponse.body.data.profession).toBe('Wizard');
    });

    test('should throw 404 if the user id does not exists', async () => {
      const userId = 999;

      const userResponse = await request(app)
        .get(`/admin/profile/${userId}`);

      expect(userResponse.status).toBe(404);
      expect(userResponse.body).toStrictEqual({ message: 'User not found!' });
    });
  })
});