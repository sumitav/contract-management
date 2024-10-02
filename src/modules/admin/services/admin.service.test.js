import { describe, test, beforeEach, expect, jest } from '@jest/globals';

import { JobFacade } from '../../../../test/mocks/jobs/job-facade.mock.js';
import { sequelize } from '../../../shared/database/sequelize.client.js';
import { AdminService } from './admin.service.js';

describe('Test suit for AdminService', () => {
  let jobFacade;
  let service;

  beforeEach(() => {
    service = new AdminService();
    jobFacade = new JobFacade();
  });

  describe('#getBestProfession', () => {
    test('should be able to get the best profession', async () => {
      const bestProfession = jobFacade.buildBestProfession();

      jest.spyOn(sequelize, 'query').mockImplementationOnce(() => bestProfession);
      const result = await service.getBestProfession();

      expect(result).toStrictEqual(bestProfession);
    });
  });

  describe('#getBestClients', () => {
    test('should be able to get the best clients', async () => {
      const getBestClients = jobFacade.buildBestClients();

      jest.spyOn(sequelize, 'query').mockImplementationOnce(() => getBestClients);
      const result = await service.getBestClients();

      const formattedResult = getBestClients.map((bestClient) => {
        return {
          paid: bestClient.paid,
          id: bestClient.id,
          fullName: `${bestClient.firstName} ${bestClient.lastName}`
        }
      })

      expect(result).toStrictEqual(formattedResult);
    });
  });
});