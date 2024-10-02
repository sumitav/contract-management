import Router from 'express';

import contractRoutes from './contract.route.js';
import balanceRoutes from './balance.route.js';
import adminRoutes from './admin.route.js';
import jobRoutes from './job.route.js';

const router = Router();

router.use('/contracts', contractRoutes);
router.use('/balances', balanceRoutes);
router.use('/admin', adminRoutes);
router.use('/jobs', jobRoutes);

export default router;