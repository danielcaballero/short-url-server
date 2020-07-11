import { Schema, Document, Model, model } from 'mongoose';

const UrlSchema = new Schema({
  url: String,
  shortUrl: {
    type: String,
    unique: true
  },
  createdAt: Date
});

export interface IUrl {
  url: string;
  shortUrl: string;
  createdAt: Date;
}

export type IUrlSchema = Document & IUrl;

export type IUrlModel = Model<IUrlSchema>;

export const Url = model<IUrlSchema, IUrlModel>('Url', UrlSchema);



