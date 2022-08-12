const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
//define agent so that each agent call is single session and not it's own call
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
    //streamlined login line for mocks auth test
    await agent.get('/api/v1/github/callback?code=42').redirects(1);

    const res = await agent.get('/api/v1/posts');
    expect(res.status).toBe(200);
    expect(res.body[0].content).toEqual('this is a post');
  });
  it('#get /posts returns a 401 to an unauthenticated user', async () => {
    await agent.get('/api/v1/github/callback?code=42').redirects(1);
    let res = await agent.delete('/api/v1/github/');
    expect(res.body).toEqual({
      message: 'log out successful',
    });
    res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401,
    });
  });
  it('#post /posts authenticated users can create posts', async () => {
    const user = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    //request and agent each have their own cookie we have to use agent throughout to avoid separate 401
    const res = await agent.post('/api/v1/posts').send({
      user_id: user.body.id,
      title: 'test post',
      content: 'This is a test post',
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      user_id: expect.any(String),
      title: 'test post',
      content: 'This is a test post',
    });
  });

  afterAll(() => {
    pool.end();
  });
});
