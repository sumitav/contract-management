import { describe, test, beforeEach, expect, jest } from '@jest/globals';


import { ContractFacade } from '../../../../test/mocks/contract/contract-facade.mock.js';
import AppError from '../../../shared/errors/app.error.js';
import { GetContract } from '../dtos/get-contract.dto.js';
import { ContractService } from './contract.service.js';
import { Contract } from '../models/contract.model.js';


describe('Test suit for ContractService', () => {
  let contractFacade;
  let service;

  beforeEach(() => {
    contractFacade = new ContractFacade();
    service = new ContractService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#index', () => {
    test('should be able to get a list of non terminated contracts belonging to a client', async () => {
      const clientId = 1;
      const contractsMock = contractFacade.buildNonTerminatedContractsByClientId(clientId);

      jest.spyOn(Contract, 'findAll').mockImplementationOnce(() => contractsMock);

      const result = await service.index(clientId);

      const expected = contractsMock.map((contract) => GetContract.factory(contract));

      expect(result).toStrictEqual(expected);
    });

    test('should be able to get a list of non terminated contracts belonging to a contractor', async () => {
      const contractorId = 6;
      const contractsMock = contractFacade.buildNonTerminatedContractsByContractorId(contractorId);

      jest.spyOn(Contract, 'findAll').mockImplementationOnce(() => contractsMock);

      const result = await service.index(contractorId);

      const expected = contractsMock.map((contract) => GetContract.factory(contract));

      expect(result).toStrictEqual(expected);
    });
  });

  describe('#getContractById', () => {
    test('should be able to get the contracts for the user profile who is calling', async () => {
      const contractId = 3;
      const clientId = 2;
      const contractMock = contractFacade.buildContractByIdAndClientId(contractId, clientId);

      jest.spyOn(Contract, 'findOne').mockImplementationOnce(() => contractMock);

      const result = await service.getContractById(contractId, clientId);
      const expected = GetContract.factory(contractMock);

      expect(result).toStrictEqual(expected);
    });

    test('should not return the contract if it not belongs to the profile calling', async () => {
      jest.spyOn(Contract, 'findOne').mockImplementationOnce(() => null);

      await expect(
        service.getContractById(12345, 12345)
      ).rejects.toEqual(
        new AppError('Contract not found!', 404)
      );
    });
  });
});