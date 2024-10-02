import { Router } from 'express';

import { getProfile } from '../middleware/get-profile.middleware.js';
import { jobController } from '../../modules/index.js';

const jobRoutes = Router();

jobRoutes.get('/getById/:jobId', getProfile, jobController.getJobById.bind(jobController));
jobRoutes.post('/:job_id/pay', getProfile, jobController.makePayment.bind(jobController));
jobRoutes.get('/unpaid', getProfile, jobController.getUnpaid.bind(jobController));

export default jobRoutes;