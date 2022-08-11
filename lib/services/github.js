const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  //take code from github and exchange for token
  const client_id = process.env.GH_CLIENT_ID;
  const client_secret = process.env.GH_CLIENT_SECRET;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ client_id, client_secret, code }),
  });
  const { access_token } = await response.json();
  return access_token;
};
const getGithubProfile = async (token) => {
  //exchange token for profile info
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  return response.json();
};

module.exports = { exchangeCodeForToken, getGithubProfile };
