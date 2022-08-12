const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

const router = Router();

module.exports = router.get('/posts', authenticate, async (req, res, next) => {
  try {
    const response = await this.post.getAll();
    res.json(response);
  } catch (error) {
    next(error);
  }
});
