const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const agent = request.agent(app);

jest.mock('../lib/services/github');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
  it('#delete /sessions deletes cookie and logs out user', async () => {
    let res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.status).toBe(200);

    res = await agent.delete('/api/v1/github/');
    expect(res.body).toEqual({
      message: 'log out successful',
    });
  });
  it('#get /posts returns a list of posts to an authenticated user', async () => {
    await agent.get('/api/v1/github/callback?code=42').redirects(1);

    const res = await agent.get('/api/v1/posts');
    expect(res.status).toBe(200);
    expect(res.body[0].content).toEqual('this is a post');
  });

  afterAll(() => {
    pool.end();
  });
});
