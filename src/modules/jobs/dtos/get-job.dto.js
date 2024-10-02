class GetJobContractDto {
  static factory(contract) {
    return {
      id: contract.id,
      status: contract.status,
      ContractorId: contract.ContractorId,
      ClientId: contract.ClientId,
    }
  }
}

export class GetJobDto {
  static factory(job) {
    return {
      id: job.id,
      description: job.description,
      price: job.price,
      paid: job.paid,
      paymentDate: job.paymentDate,
      ContractId: job.ContractId,
      Contract: GetJobContractDto.factory(job.Contract)
    }
  }
}