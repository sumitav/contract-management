import { ContractFluentAPI } from "./contract-fluent-api.mock";

export class ContractFacade {
  #contractFluentAPI;

  constructor() {
    this.#contractFluentAPI = new ContractFluentAPI();
  }

  buildNonTerminatedContractsByClientId(id) {
    return this.#contractFluentAPI
      .getContractByClientId(id)
      .getNonTerminatedContracts()
      .buildContract();
  }

  buildNonTerminatedContractsByContractorId(id) {
    return this.#contractFluentAPI
      .getContractByContractorId(id)
      .getNonTerminatedContracts()
      .buildContract();
  }

  buildContractByIdAndClientId(contractId, clientId) {
    return this.#contractFluentAPI
      .getContractById(contractId)
      .getContractByClientId(clientId)
      .buildContract();
  }
}