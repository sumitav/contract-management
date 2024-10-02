import { QueryTypes } from 'sequelize';

import { sequelize } from '../../../shared/database/sequelize.client.js';
import AppError from '../../../shared/errors/app.error.js';
import { Profile } from '../models/profile.model.js';
import { UserDto } from '../dtos/user.dto.js'

export class AdminService {
  #defaultQueryLimit;

  constructor() {
    this.#defaultQueryLimit = 2;
  }

  async getProfileById(id) {
    const user = await Profile.findOne({
      where: {
        id
      }
    });

    if (!user) {
      throw new AppError('User not found!', 404);
    }

    return UserDto.factory(user);
  }

  async getBestProfession(startDate, endDate) {
    let query = `
      SELECT sum(jobs.price) as totalPaid,
             profiles.profession
        FROM jobs
        JOIN contracts ON
             (contracts.id = jobs.ContractId)
        JOIN profiles ON
             (profiles.id = contracts.ContractorId)
       WHERE jobs.paid = true
    `;

    let replacements = {};

    if (startDate && endDate) {
      query += 'AND jobs.paymentDate between :startDate and :endDate ';
      replacements = { startDate, endDate };
    }

    query += 'GROUP BY profiles.profession';

    const results = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    return results;
  }

  async getBestClients(startDate, endDate, limit) {
    limit = limit ? parseInt(limit) : this.#defaultQueryLimit;

    let query = `
      SELECT sum(jobs.price) as paid,
             profiles.id,
             profiles.firstName,
             profiles.lastName
        FROM jobs
        JOIN contracts ON
             (contracts.id = jobs.ContractId)
        JOIN profiles ON
             (profiles.id = contracts.ClientId)
       WHERE jobs.paid = true
    `;

    let replacements = { limit };

    if (startDate && endDate) {
      query += 'AND jobs.paymentDate between :startDate and :endDate ';
      replacements = { ...replacements, startDate, endDate };
    }

    query += 'GROUP BY profiles.id ';
    query += 'ORDER BY 1 DESC LIMIT :limit';

    const results = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    return results.map((result) => {
      return {
        paid: result.paid,
        id: result.id,
        fullName: `${result.firstName} ${result.lastName}`
      }
    });
  }
}