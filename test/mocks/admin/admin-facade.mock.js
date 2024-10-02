import { AdminFluentAPI } from "./admin-fluent-api.mock";

export class AdminFacade {
  #adminFluentAPI;

  constructor() {
    this.#adminFluentAPI = new AdminFluentAPI();
  }

  buildClientProfile() {
    return this.#adminFluentAPI
      .getClient()
      .buildProfile();
  }

  buildContractorProfile() {
    return this.#adminFluentAPI
      .getContractor()
      .buildProfile();
  }

  buildClientWithNoBalance() {
    return this.#adminFluentAPI
      .getClient()
      .getWithNoBalance()
      .buildProfile();
  }
}