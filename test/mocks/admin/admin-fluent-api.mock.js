import { adminMock } from "./admin.mock";

export class AdminFluentAPI {
  #data;

  constructor() {
    this.#data = adminMock;
  }

  getClient() {
    this.#data = this.#data.filter((profile) => profile.type === 'client');

    return this;
  }

  getContractor() {
    this.#data = this.#data.filter((profile) => profile.type === 'contractor');

    return this;
  }

  getWithNoBalance() {
    this.#data = this.#data.filter((profile) => profile.balance === 0);

    return this;
  }

  buildProfile() {
    return this.#data;
  }
}