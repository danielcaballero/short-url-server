import { Router } from 'express';
import UrlRouter from './urls';
import AdminRouter from './admin';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/admin', AdminRouter);
router.use('/urls', UrlRouter);

// Export the base-router
export default router;
