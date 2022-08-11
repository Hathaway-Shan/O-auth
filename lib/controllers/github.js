const { Router } = require('express');
const router = Router();
// const jwt = require('jsonwebtoken');
const {
  exchangeCodeForToken,
  // getGithubProfile,
} = require('../services/github');

module.exports = router
  .get('/login', async (req, res) => {
    //kicks off the flow between app and github
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`
    );
  })
  .get('/callback', async (req, res) => {
    const { code } = req.query;
    //exchange code for token
    const token = await exchangeCodeForToken(code);
    res.json({ token });
  });
