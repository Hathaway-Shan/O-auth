const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const {
  exchangeCodeForToken,
  getGithubProfile,
} = require('../services/github');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = router
  .get('/login', async (req, res) => {
    //kicks off the flow between app and github
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`
    );
  })
  .get('/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      //exchange code for token
      const token = await exchangeCodeForToken(code);
      //get info about user for token
      const GithubProfile = await getGithubProfile(token);
      let user = await GithubUser.findByUsername(GithubProfile.login);
      //if no user exists we make one
      if (!user) {
        user = await GithubUser.insert({
          username: GithubProfile.login,
          email: GithubProfile.email,
          avatar: GithubProfile.avatar_url,
        });
      }
      //create jwt
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      // set cookie and redirect
      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (e) {
      next(e);
    }
  })
  .get('/dashboard', authenticate, async (req, res) => {
    // get data about user and send as json
    res.json(req.user);
  })
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Sign out Successful' });
  });
