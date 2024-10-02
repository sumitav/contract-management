import { jobMock } from "./job.mock";

export class JobFluentAPI {
  #data;

  constructor() {
    this.#data = jobMock;
  }

  getJobsByClientId(clientId) {
    this.#data = this.#data.filter((job) => job.Contract.ClientId === clientId) || [];

    return this;
  }

  getUnpaidJobs() {
    this.#data = this.#data.filter((job) => !job.paid) || [];

    return this;
  }

  getJobsWithContractInProgress() {
    this.#data = this.#data.filter((job) => job.Contract.status === 'in_progress') || [];

    return this;
  }

  getJobsWithContractTerminated() {
    this.#data = this.#data.filter((job) => job.Contract.status === 'terminated') || [];

    return this;
  }

  getJobsAlreadyPaid() {
    this.#data = this.#data.filter((job) => job.paid) || [];

    return this;
  }

  buildJobs() {
    return this.#data;
  }
}