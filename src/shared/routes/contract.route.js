import { Router } from 'express';

import { getProfile } from '../middleware/get-profile.middleware.js';
import { contractController } from '../../modules/index.js';

const contractRoutes = Router();

contractRoutes.get('/', getProfile, contractController.index.bind(contractController));
contractRoutes.get('/:id', getProfile, contractController.getById.bind(contractController));

export default contractRoutes;