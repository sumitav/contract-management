export class GetContract {
  static factory(contract) {
    return {
      id: contract.id,
      terms: contract.terms,
      status: contract.status,
      ContractorId: contract.ContractorId,
      ClientId: contract.ClientId,
    }
  }
}