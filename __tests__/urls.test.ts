
import app from '@server';
import request from 'supertest';
import { mocked } from "ts-jest/utils";

import { Url, IUrlSchema, IUrl } from '@model/Urls'
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { DocumentQuery } from 'mongoose';

jest.mock('@model/Urls');
jest.mock('@shared/logger');

const UrlMock = mocked(Url, true);

const fakeUrls = [
  "http://www.google.com",
  "http://www.amazon.com",
];

const fakeShortUrls: IUrl[] = fakeUrls.map((url, i) => ({
  url,
  shortUrl: `http://short${i}`,
  createdAt: new Date()
}));

describe('GET /urls', () => {
  beforeEach(() => {
    UrlMock.mockClear();
  });

  it('should get list of short urls', async () => {
    UrlMock.find.mockImplementationOnce(
      () => ({ sort: async () => fakeShortUrls } as unknown as DocumentQuery<IUrlSchema[], IUrlSchema>)
    );

    const res = await request(app).get('/urls');
    
    expect(res.ok).toEqual(true);
    expect(res.body).toEqual(fakeShortUrls.map(shortUrl => ({ ...shortUrl, createdAt: shortUrl.createdAt.toISOString() })));
  });

  it('should return HTTP error 500', async () => {
    UrlMock.find.mockImplementationOnce(
      () => ({ sort: () => { throw new Error() } } as unknown as DocumentQuery<IUrlSchema[], IUrlSchema>)
    );

    const res = await request(app).get('/urls');
    
    expect(res.error.toString()).toEqual('Error: cannot GET /urls (500)');
    expect(res.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(res.body).toEqual({});
  })
});

describe('POST /urls', () => {
  beforeEach(() => {
    UrlMock.mockClear();
  });

  it('should create short url', async () => {
    const saveMock = jest.fn(() => Promise.resolve());
    UrlMock.mockImplementationOnce(() => ({ save: saveMock } as unknown as IUrlSchema));
    const res = await request(app)
      .post('/urls')
      .type('form')
      .send({ url: fakeUrls[0] })
      .set('Accept', 'application/json');
    
    expect(UrlMock).toHaveBeenCalledWith({
      url: fakeUrls[0],
      shortUrl: expect.stringContaining('https://pbid.io/'),
      createdAt: expect.any(Date),
    });
    expect(saveMock).toHaveBeenCalled();
    expect(res.ok).toEqual(true);
  });

  it('should return HTTP error 500', async () => {
    UrlMock.mockImplementationOnce(() => ({ save: async () => { throw new Error(); }} as unknown as IUrlSchema));
    const res = await request(app)
      .post('/urls')
      .type('form')
      .send({ url: fakeUrls[0] })
      .set('Accept', 'application/json');
    
    expect(res.error.toString()).toEqual('Error: cannot POST /urls (500)');
    expect(res.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(res.body).toEqual({});
  });

  it('should return HTTP error 400 if invalid URL', async () => {
    UrlMock.mockImplementationOnce(() => ({ save: async () => { throw new Error(); }} as unknown as IUrlSchema));
    const res = await request(app)
      .post('/urls')
      .type('form')
      .send({ url: 'some.rubish' }) 
      .set('Accept', 'application/json');
    
    expect(res.error.toString()).toEqual('Error: cannot POST /urls (400)');
    expect(res.status).toEqual(BAD_REQUEST);
    expect(res.body).toEqual({ error: "One or more of the required parameters does not conform to expected format."});
  });

  it('should return HTTP error 400 if request body does not have "url" property', async () => {
    UrlMock.mockImplementationOnce(() => ({ save: () => Promise.resolve() } as unknown as IUrlSchema));
    const res = await request(app)
      .post('/urls')
      .type('form')
      .send({ foo: 'bar' })
      .set('Accept', 'application/json');
    
    expect(res.error.toString()).toEqual('Error: cannot POST /urls (400)');
    expect(res.status).toEqual(BAD_REQUEST);
    expect(res.body).toEqual({ error: "One or more of the required parameters was missing."});
  });
});
