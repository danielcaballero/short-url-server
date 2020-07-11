import mongoose from 'mongoose';
import logger from '@shared/logger'

export default class Db {
    private static readonly DEFAULT_MONGODB_URI: string = 'mongodb://localhost:27017/pbid'
    private uri: string;

    constructor(uri: string = Db.DEFAULT_MONGODB_URI) {
        this.uri = uri;
    }

    private async _connect() {
        try {
            await mongoose.connect(this.uri, { useNewUrlParser: true });
            logger.info('MongoDB Conected');
        } catch (err) {
            logger.error(`Error connecting to MongoDB: ${err.message}`);
            process.exit(1);
        }
    }

    connect(): Promise<void> | void {
        // we won't connect to DB in test mode
        if (process.env.NODE_ENV !== 'test') {
            return this._connect();
        } else {
            logger.info('Skipping DB connection for testing...')
        }
    }
}

