import { Request, Response, Router } from 'express';
import { OK, NOT_FOUND } from 'http-status-codes';

// Init shared
const router = Router();

/******************************************************************************
 *                      Get Server Version - "GET /version"
 ******************************************************************************/

router.get('/version', async (req: Request, res: Response) => {
    const version = process.env.APP_VERSION;
    if (!version) {
        return res.status(NOT_FOUND).end();
    }
    return res.status(OK).json({ version });
});

export default router;
