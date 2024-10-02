import { MathUtil } from '../../../shared/utils/math.utils.js';
import AppError from '../../../shared/errors/app.error.js';
import { JobService } from '../../jobs/index.js';
import { Profile } from '../../admin/index.js';

export class BalanceService {
  #allowedPercentage;
  #jobService;

  constructor() {
    this.#jobService = new JobService();

    this.#allowedPercentage = 25;
  }

  async makeDeposit(userId, value, profileId) {
    if (userId !== profileId) {
      throw new AppError('You cannot deposit into a profile that not belongs to you!')
    }

    if (value <= 0) {
      throw new AppError('Invalid amount!');
    }

    const user = await Profile.findOne({
      where: {
        id: profileId,
      }
    })

    const amountOfJobs = await this.#jobService.getAmountOfJobsToPayByUserId(profileId);

    if (amountOfJobs !== 0) {
      const percentage = MathUtil.getPercentageFromANumber(amountOfJobs, this.#allowedPercentage);

      if (value > percentage) {
        throw new AppError(`Invalid amount, it should be less than 25% of your unpaid jobs: ${percentage}`);
      }
    }

    await Profile.update(
      { balance: MathUtil.sum(user.balance, value) },
      { where: { id: userId } }
    );
  }
}