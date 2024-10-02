import { describe, test, expect, beforeEach, jest, afterEach } from '@jest/globals';


import { AdminFacade } from '../../../../test/mocks/admin/admin-facade.mock';
import { JobFacade } from '../../../../test/mocks/jobs/job-facade.mock';
import AppError from '../../../shared/errors/app.error';
import { GetJobDto } from '../dtos/get-job.dto';
import { Profile } from '../../admin/index.js';
import { JobService } from './job.service';
import { Job } from '../models/job.model';

describe('Test suit for JobService', () => {
  let adminFacade;
  let jobFacade;
  let service;

  beforeEach(() => {
    adminFacade = new AdminFacade();
    jobFacade = new JobFacade();
    service = new JobService();
  });

  afterEach(() => {
    jest.resetAllMocks()
  });

  describe('#getUnpaid', () => {
    test('should be able to get all unpaid jobs for a user (either a client or contractor), for active contracts only', async () => {
      const mockedJobs = jobFacade.buildUnpaidJobs();

      jest.spyOn(Job, 'findAll').mockImplementationOnce(() => mockedJobs);

      const result = await service.getUnpaid(1);

      const expected = mockedJobs.map((mockedJob) => GetJobDto.factory(mockedJob));

      expect(result).toStrictEqual(expected);
    });
  });

  describe('#makePayment', () => {
    test('should be able for a client to make a payment', async () => {
      const [client] = adminFacade.buildClientProfile();
      const [jobWithContractInProgress] = jobFacade.buildJobsWithContractInProgressByClientId(client.id);

      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => jobWithContractInProgress);
      jest.spyOn(Profile, 'findOne').mockImplementationOnce(() => client);

      const spy = jest.spyOn(service, 'makePayment');

      await service.makePayment(1, client.id);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('should not be able for a client to make a payment if the job does not exists', async () => {
      const [client] = adminFacade.buildClientProfile();

      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => null);

      await expect(
        service.makePayment(99999, client.id)
      ).rejects.toEqual(
        new AppError('Invalid job id!'),
      );
    });

    test('should not be able for a client to make a payment if the job is already paid', async () => {
      const [jobAlreadyPaid] = jobFacade.buildJobsAlreadyPaid();
      const [client] = adminFacade.buildClientProfile();

      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => jobAlreadyPaid);
      jest.spyOn(Profile, 'findOne').mockImplementationOnce(() => client);

      await expect(
        service.makePayment(jobAlreadyPaid.id, client.id)
      ).rejects.toEqual(
        new AppError('Job is already paid!'),
      );
    });

    test('should not be able for a client to make a payment if the contract is already finished', async () => {
      const [client] = adminFacade.buildClientProfile();
      const [JobWithContractTerminated] = jobFacade.buildJobsWithContractTerminatedByClientId(client.id);

      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => JobWithContractTerminated);
      jest.spyOn(Profile, 'findOne').mockImplementationOnce(() => client);

      await expect(
        service.makePayment(JobWithContractTerminated.id, client.id)
      ).rejects.toEqual(
        new AppError('The contract is already finished'),
      );
    });

    test('should not be able for a client to make a payment if his balance is less than the amount', async () => {
      const [clientWithNoBalance] = adminFacade.buildClientWithNoBalance();
      const [unpaidJob] = jobFacade.buildUnpaidJobsAndInProgressContractsByClientId(clientWithNoBalance.id);

      jest.spyOn(Profile, 'findOne').mockImplementationOnce(() => clientWithNoBalance);
      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => unpaidJob);

      await expect(
        service.makePayment(unpaidJob.id, clientWithNoBalance.id)
      ).rejects.toEqual(
        new AppError('Check your available money!'),
      );
    });

    test('should not be able to a client pay for a other client job', async () => {
      const [client] = adminFacade.buildClientProfile();
      const [jobWithContractInProgress] = jobFacade.buildJobsWithContractInProgressByClientId(client.id);

      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => jobWithContractInProgress);

      await expect(
        service.makePayment(jobWithContractInProgress.id, 99)
      ).rejects.toEqual(
        new AppError('Invalid job id!'),
      );
    });

    test('should not be able to a contractor pay for a job, only clients are allowed to do it', async () => {
      const [contractor] = adminFacade.buildContractorProfile();
      const [jobWithContractInProgress] = jobFacade.buildJobsWithContractInProgressByClientId(1);

      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => jobWithContractInProgress);
      jest.spyOn(Profile, 'findOne').mockImplementationOnce(() => contractor);

      await expect(
        service.makePayment(jobWithContractInProgress.id, contractor.id)
      ).rejects.toEqual(
        new AppError('Invalid job id!'),
      );
    });

    test('should throw an error when something went wrong during the database transaction', async () => {
      const [client] = adminFacade.buildClientProfile();
      const [jobWithContractInProgress] = jobFacade.buildJobsWithContractInProgressByClientId(client.id);

      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => jobWithContractInProgress);
      jest.spyOn(Profile, 'findOne').mockImplementationOnce(() => client);
      jest.spyOn(Profile, 'update').mockRejectedValueOnce(() => new Error('error!'));

      await expect(
        service.makePayment(jobWithContractInProgress.id, client.id)
      ).rejects.toEqual(
        new AppError('Error while saving payment!'),
      );
    })
  });

  describe('#getJobById', () => {
    test('should be able to a client get his own job by id', async () => {
      const [mockedJob] = jobFacade.buildUnpaidJobs();

      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => mockedJob);

      const result = await service.getJobById(mockedJob.id, mockedJob.Contract.ClientId);

      expect(result).toStrictEqual(GetJobDto.factory(mockedJob));
    });

    test('should throw a error if the job does not exists', async () => {
      jest.spyOn(Job, 'findOne').mockImplementationOnce(() => null);

      await expect(
        service.getJobById(1, 1)
      ).rejects.toEqual(
        new AppError('Invalid jobId!'),
      );
    });
  });
});