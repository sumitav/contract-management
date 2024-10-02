import { Op } from 'sequelize';

import { sequelize } from '../../../shared/database/sequelize.client.js';
import { Contract } from '../../contracts/models/contract.model.js';
import { MathUtil } from '../../../shared/utils/math.utils.js';
import AppError from '../../../shared/errors/app.error.js';
import { GetJobDto } from '../dtos/get-job.dto.js';
import { Profile } from '../../admin/index.js';
import { Job } from '../models/job.model.js';

export class JobService {
  async getUnpaid(profileId) {
    const unpaidJobs = await Job.findAll({
      include: {
        model: Contract,
        where: {
          [Op.or]: [
            { 'ClientId': profileId },
            { 'ContractorId': profileId },
          ]
        }
      },
      where: {
        paid: null
      }
    });

    return unpaidJobs.map((unpaidJob) => GetJobDto.factory(unpaidJob));
  }

  async makePayment(jobId, profileId) {
    const job = await Job.findOne({
      include: Contract,
      where: {
        id: jobId,
      }
    });

    if (!job || job.Contract.ClientId !== profileId) {
      throw new AppError('Invalid job id!');
    }

    if (job.paid) {
      throw new AppError('Job is already paid!');
    }

    if (job.Contract.status === 'terminated') {
      throw new AppError('The contract is already finished');
    }

    const user = await Profile.findOne({
      where: {
        id: profileId
      }
    });

    if (user.balance < job.price) {
      throw new AppError('Check your available money!');
    }

    await this._savePayment(job, user);
  }

  async getAmountOfJobsToPayByUserId(profileId) {
    const jobs = await Job.findAll({
      include: [
        {
          model: Contract,
          include: [
            {
              model: Profile,
              as: 'Client',
              where: {
                id: profileId
              }
            }
          ]
        }
      ],
      where: {
        paid: null
      }
    });

    return jobs.reduce((previousValue, currentValue) => previousValue + currentValue.price, 0);
  }

  async getJobById(jobId, profileId) {
    const job = await Job.findOne({
      include: {
        model: Contract,
        where: {
          [Op.or]: [
            { 'ClientId': profileId },
            { 'ContractorId': profileId },
          ]
        }
      },
      where: {
        id: jobId
      }
    });

    if (!job) {
      throw new AppError('Invalid jobId!');
    }

    return GetJobDto.factory(job);
  }

  async _savePayment(job, user) {
    const t = await sequelize.transaction();

    try {
      const contractor = await Profile.findOne({
        where: {
          id: job.Contract.ContractorId,
        },
        transaction: t
      });

      await Profile.update(
        { balance: MathUtil.min(user.balance, job.price) },
        { where: { id: user.id }, transaction: t },
      );

      await Profile.update(
        { balance: MathUtil.sum(contractor.balance + job.price) },
        { where: { id: contractor.id }, transaction: t },
      );

      await Job.update(
        { paid: true, paymentDate: new Date() },
        { where: { id: job.id }, transaction: t }
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new AppError('Error while saving payment!')
    }
  }
}