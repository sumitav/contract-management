import { describe, test, expect } from '@jest/globals';
import request from 'supertest';

import { HeaderMock } from '../../../../test/mocks/headers/header.mock';
import app from '../../../app.js';

describe('Test suit for BalanceController', () => {
  describe('/balances/deposit/:userId', () => {
    test('should be able to deposits money into the balance of a client', async () => {
      const userId = 1;
      const customHeaders = HeaderMock.factory(userId);

      const userResponse = await request(app)
        .get(`/admin/profile/${userId}`);

      const response = await request(app)
        .post(`/balances/deposit/${userId}`)
        .send({ value: 200 })
        .set(customHeaders);

      const userResponseAfterDeposit = await request(app)
        .get(`/admin/profile/${userId}`);

      expect(response.status).toBe(201);

      expect(userResponse.body.data).toStrictEqual({
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client'
      });

      expect(userResponseAfterDeposit.body.data).toStrictEqual({
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1350,
        type: 'client'
      });
    });

    test('should not be able to deposit more than 25% his total of jobs to pay', async () => {
      const userId = 1;
      const customHeaders = HeaderMock.factory(userId);

      const response = await request(app)
        .post(`/balances/deposit/${userId}`)
        .send({ value: 2000 })
        .set(customHeaders);

      expect(response.body.message).toBe('Invalid amount, it should be less than 25% of your unpaid jobs: 250.75');
      expect(response.status).toBe(400);
    });

    test('should not be able to deposit money in an account that not belongs to the logged user', async () => {
      const userId = 1;
      const customHeaders = HeaderMock.factory(2);

      const response = await request(app)
        .post(`/balances/deposit/${userId}`)
        .send({ value: 200 })
        .set(customHeaders);

      expect(response.body.message).toBe('You cannot deposit into a profile that not belongs to you!');
      expect(response.status).toBe(400);
    });

    test('should not be able to a client deposit less than or equal to 0', async () => {
      const userId = 2;
      const customHeaders = HeaderMock.factory(userId);

      const response = await request(app)
        .post(`/balances/deposit/${userId}`)
        .send({ value: 0 })
        .set(customHeaders);

      expect(response.body.message).toBe('Invalid amount!');
      expect(response.status).toBe(400);
    });
  });
});