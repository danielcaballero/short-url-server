import { Request, Response, Router } from 'express';
import { isUri } from 'valid-url';
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { customAlphabet } from 'nanoid'

import { Url } from '@model/Urls';

import { paramMissingError, paramInvalidError } from '@shared/constants';
import logger from '@shared/logger';

// Only allow alphanumeric characters a-zA-Z0-9
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

const router = Router();

/******************************************************************************
 *                       Create short URL - "POST /urls"
 ******************************************************************************/

router.post('/', async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    if (!isUri(url)) {
        return res.status(BAD_REQUEST).json({
            error: paramInvalidError,
        });
    }

    const urlModel = new Url({ url, shortUrl: `https://pbid.io/${nanoid()}`, createdAt: new Date() });

    try {
        await urlModel.save();
        return res.status(CREATED).end();
    } catch(err) {
        logger.error('Error creating short URL', err.message);
        return res.status(INTERNAL_SERVER_ERROR).end();
    }
});

/******************************************************************************
 *                       Find short URLs - "GET /urls"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    try {
        const urls = await Url.find().sort({ _id: -1 });
        return res.status(OK).json(urls);
    } catch(err) {
        logger.error('Error getting short URLs', err.message);
        return res.status(INTERNAL_SERVER_ERROR).end();
    }
});

export default router;
