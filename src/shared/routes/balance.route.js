import { Router } from 'express';

import { getProfile } from '../middleware/get-profile.middleware.js';
import { balanceController } from '../../modules/index.js';

const balanceRoutes = Router();

balanceRoutes.post('/deposit/:userId', getProfile, balanceController.createDeposit.bind(balanceController));

export default balanceRoutes;