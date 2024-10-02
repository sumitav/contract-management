import { BalanceService } from '../services/balance.service.js';

class BalanceController {
  #balanceService;

  constructor() {
    this.#balanceService = new BalanceService();
  }

  async createDeposit(req, res) {
    const { userId } = req.params;
    const { id: profileId } = req.profile;
    const { value } = req.body;

    await this.#balanceService.makeDeposit(+userId, value, +profileId);

    return res.status(201).send();
  }
}

const balanceController = new BalanceController();

export { balanceController };