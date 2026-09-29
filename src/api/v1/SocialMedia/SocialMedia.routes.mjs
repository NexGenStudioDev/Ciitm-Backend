import { Router } from 'express';
import SocialMediaController from './SocialMedia.controller.mjs';

const router = Router();

router.get('/v1/social/link', SocialMediaController.getLinks);
router.put('/v1/social/link', SocialMediaController.updateLinks);
router.get('/link', SocialMediaController.getLinks);

export { router as SocialMediaRouter };
