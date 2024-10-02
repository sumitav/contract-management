import { JobFluentAPI } from "./job-fluent-api.mock";

export class JobFacade {
  #jobFluentAPI;

  constructor() {
    this.#jobFluentAPI = new JobFluentAPI();
  }

  buildUnpaidJobsAndInProgressContractsByClientId(clientId) {
    return this.#jobFluentAPI
      .getJobsByClientId(clientId)
      .getUnpaidJobs()
      .getJobsWithContractInProgress()
      .buildJobs();
  }

  buildUnpaidJobs() {
    return this.#jobFluentAPI
      .getUnpaidJobs()
      .buildJobs();
  }

  buildJobsWithContractInProgressByClientId(clientId) {
    return this.#jobFluentAPI
      .getJobsByClientId(clientId)
      .getJobsWithContractInProgress()
      .buildJobs();
  }

  buildJobsWithContractTerminatedByClientId(clientId) {
    return this.#jobFluentAPI
      .getJobsByClientId(clientId)
      .getUnpaidJobs()
      .getJobsWithContractTerminated()
      .buildJobs();
  }

  buildJobsAlreadyPaid() {
    return this.#jobFluentAPI
      .getJobsAlreadyPaid()
      .buildJobs();
  }

  buildAllUnpaidJobsByClientId(clientId) {
    return this.#jobFluentAPI
      .getJobsByClientId(clientId)
      .getUnpaidJobs()
      .buildJobs()
  }

  buildBestProfession() {
    const jobs = this.#jobFluentAPI
      .getJobsAlreadyPaid()
      .buildJobs();

    const bestProfessionMap = new Map();

    jobs.forEach((job) => {
      const key = job.Contract.Contractor.profession;
      const lastValue = bestProfessionMap.get(key) || 0;

      bestProfessionMap.set(key, lastValue + job.price);
    });

    return Array.from(bestProfessionMap).map(([key, value]) => ({
      totalPaid: value,
      profession: key,
    }));
  }

  buildBestClients() {
    const jobs = this.#jobFluentAPI
      .getJobsAlreadyPaid()
      .buildJobs();

    const bestClientsMap = new Map();

    jobs.forEach((job) => {
      const { id: key, firstName, lastName } = job.Contract.Client;
      const lastValue = bestClientsMap.get(key)?.paid || 0;

      bestClientsMap.set(key, {
        firstName,
        lastName,
        paid: lastValue + job.price
      });
    });

    return Array.from(bestClientsMap).map(([key, value]) => ({
      id: key,
      firstName: value.firstName,
      lastName: value.lastName,
      paid: value.paid,
    }));
  }
}