import { contractMock } from "./contract.mock";

export class ContractFluentAPI {
  #data;

  constructor() {
    this.#data = contractMock;
  }

  getContractByClientId(id) {
    this.#data = this.#data.filter((contract) => contract.ClientId === id);

    return this;
  }

  getContractByContractorId(id) {
    this.#data = this.#data.filter((contract) => contract.ContractorId === id);

    return this;
  }

  getContractById(contractId) {
    this.#data = this.#data.filter((contract) => contract.id === contractId);

    return this;
  }

  getNonTerminatedContracts() {
    this.#data = this.#data.filter((contract) => contract.status !== 'terminated');

    return this;
  }

  getContractInProgress() {
    this.#data = this.#data.filter((contract) => contract.status !== 'in_progress');

    return this;
  }

  buildContract() {
    return this.#data;
  }
}