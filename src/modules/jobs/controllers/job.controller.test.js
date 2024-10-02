import { describe, test, expect } from '@jest/globals';
import request from 'supertest';

import { HeaderMock } from '../../../../test/mocks/headers/header.mock';
import app from '../../../app.js';

describe('Test suit for JobController', () => {
  describe('/jobs/unpaid', () => {
    test('should be able to npm i --save-dev @types/supertesto get all unpaid jobs for a user (either a client or contractor), for active contracts only', async () => {
      const customHeaders = HeaderMock.factory();

      const response = await request(app)
        .get('/jobs/unpaid')
        .set(customHeaders);

      expect(response.body.data).toStrictEqual([
        {
          id: 1,
          description: 'work',
          price: 200,
          paid: null,
          paymentDate: null,
          ContractId: 1,
          Contract: {
            id: 1,
            status: 'terminated',
            ContractorId: 5,
            ClientId: 1
          }
        },
        {
          id: 2,
          description: 'work',
          price: 201,
          paid: null,
          paymentDate: null,
          ContractId: 2,
          Contract: {
            id: 2,
            status: 'in_progress',
            ContractorId: 6,
            ClientId: 1
          }
        }
      ]);
    });

    test('should return 401 if the profile does not exists on the database', async () => {
      const customHeaders = HeaderMock.factory('invalid_id');

      const response = await request(app)
        .get('/jobs/unpaid')
        .set(customHeaders);

      expect(response.status).toBe(401);
    });
  });

  describe('/jobs/:job_id/pay', () => {
    test('should be able for a client to make a payment', async () => {
      const contractorId = 6;
      const userId = 2;
      const jobId = 3;

      const customHeaders = HeaderMock.factory(userId);

      const userResponse = await request(app)
        .get(`/admin/profile/${userId}`);

      const contractorResponse = await request(app)
        .get(`/admin/profile/${contractorId}`);

      const jobResponseBeforePayment = await request(app)
        .get(`/jobs/getById/${jobId}`)
        .set(customHeaders);

      const responseFirstJobPaid = await request(app)
        .post(`/jobs/${jobId}/pay`)
        .set(customHeaders);

      const jobResponseAfterPayment = await request(app)
        .get(`/jobs/getById/${jobId}`)
        .set(customHeaders);

      const userResponseAfterPayment = await request(app)
        .get(`/admin/profile/${userId}`);

      const contractorResponseAfterPayment = await request(app)
        .get(`/admin/profile/${contractorId}`);

      expect(responseFirstJobPaid.status).toBe(201);

      // user test
      expect(userResponse.body.data).toStrictEqual({
        id: 2,
        firstName: 'Mr',
        lastName: 'Robot',
        profession: 'Hacker',
        balance: 231.11,
        type: 'client'
      });

      expect(userResponseAfterPayment.body.data).toStrictEqual({
        id: 2,
        firstName: 'Mr',
        lastName: 'Robot',
        profession: 'Hacker',
        balance: 29.11,
        type: 'client'
      });

      // contractor test
      expect(contractorResponse.body.data).toStrictEqual({
        id: 6,
        firstName: 'Linus',
        lastName: 'Torvalds',
        profession: 'Programmer',
        balance: 1214,
        type: 'contractor'
      });

      expect(contractorResponseAfterPayment.body.data).toStrictEqual({
        id: 6,
        firstName: 'Linus',
        lastName: 'Torvalds',
        profession: 'Programmer',
        balance: 1416,
        type: 'contractor'
      });

      // job test
      expect(jobResponseBeforePayment.body.data.paid).toEqual(null);
      expect(jobResponseBeforePayment.body.data.paymentDate).toBe(null);

      expect(jobResponseAfterPayment.body.data.paid).toEqual(true);
      expect(jobResponseAfterPayment.body.data.paymentDate).not.toBe(null);
    });

    test('should not be able for a client to make a payment if his balance is less than the amount', async () => {
      const userId = 2;
      const customHeaders = HeaderMock.factory(userId);

      const responseSecondJobPaid = await request(app)
        .post('/jobs/4/pay')
        .set(customHeaders);

      expect(responseSecondJobPaid.status).toBe(400);
      expect(responseSecondJobPaid.body.message).toBe('Check your available money!');
    });
  });

  describe('/jobs/getById/:jobId', () => {
    test('should be able to get a job for a client by jobId', async () => {
      const userId = 1;
      const customHeaders = HeaderMock.factory(userId);

      const response = await request(app)
        .get('/jobs/getById/1')
        .set(customHeaders);

      expect(response.status).toBe(200);
      expect(response.body.data).toStrictEqual({
        id: 1,
        description: 'work',
        price: 200,
        paid: null,
        paymentDate: null,
        ContractId: 1,
        Contract: { id: 1, status: 'terminated', ContractorId: 5, ClientId: 1 }
      });
    });
    test('should throw 404 when trying to get a jobId that does not exists', async () => {
      const userId = 1;
      const customHeaders = HeaderMock.factory(userId);

      const response = await request(app)
        .get('/jobs/getById/999')
        .set(customHeaders);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid jobId!');
    });

    test('should throw 404 when trying to get a job that not belongs to the user', async () => {
      const userId = 1;
      const customHeadersForUser1 = HeaderMock.factory(userId);

      const response = await request(app)
        .get('/jobs/getById/1')
        .set(customHeadersForUser1);

      expect(response.status).toBe(200);
      expect(response.body.data).toStrictEqual({
        id: 1,
        description: 'work',
        price: 200,
        paid: null,
        paymentDate: null,
        ContractId: 1,
        Contract: { id: 1, status: 'terminated', ContractorId: 5, ClientId: 1 }
      });

      const customHeadersForUser2 = HeaderMock.factory(2);

      const jobResponseFromAnotherUser = await request(app)
        .get('/jobs/getById/1')
        .set(customHeadersForUser2);

      expect(jobResponseFromAnotherUser.status).toBe(400);
      expect(jobResponseFromAnotherUser.body.message).toBe('Invalid jobId!');
    });

  });
});