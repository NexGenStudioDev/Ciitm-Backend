import { Router } from 'express';
import QueueController from './Queue.controller.mjs';

const router = Router();

router.get('/v1/queue/status', QueueController.getStatus);
router.get('/v1/queue/list', QueueController.getQueues);
router.post('/v1/queue/publish', QueueController.publishMessage);

export { router as QueueRouter };
