import { Router } from 'express';

import { adminController } from '../../modules/index.js';

const adminRoutes = Router();

adminRoutes.get('/best-profession', adminController.getBestProfession.bind(adminController));
adminRoutes.get('/best-clients', adminController.getBestClients.bind(adminController));
adminRoutes.get('/profile/:id', adminController.getProfileById.bind(adminController));

export default adminRoutes;