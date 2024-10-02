import { Op } from 'sequelize';

import AppError from '../../../shared/errors/app.error.js';
import { GetContract } from '../dtos/get-contract.dto.js';
import { Contract } from '../models/contract.model.js';
import { Profile } from '../../admin/index.js';

export class ContractService {
  _getRelationByType(profileId, type) {
    const relation = {
      client: {
        model: Profile,
        as: 'Client',
        where: {
          type: 'client',
          id: profileId,
        },
      },
      contractor: {
        model: Profile,
        as: 'Contractor',
        where: {
          type: 'contractor',
          id: profileId,
        },
      }
    }

    return relation[type];
  }

  async index(profileId, type) {
    const contracts = await Contract.findAll({
      include: [this._getRelationByType(profileId, type)],
      where: {
        status: { [Op.not]: 'terminated' },
      }
    });

    return contracts.map((contract) => GetContract.factory(contract));
  }

  async getContractById(contractId, profileId) {
    const contract = await Contract.findOne({
      where: { id: contractId, 'ClientId': profileId }
    });

    if (!contract) {
      throw new AppError('Contract not found!', 404);
    }

    return GetContract.factory(contract);
  }
}