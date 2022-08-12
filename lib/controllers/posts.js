const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

const router = Router();

module.exports = router.get('/', authenticate, async (req, res, next) => {
  try {
    const response = await Post.getAll();
    res.json(response);
  } catch (error) {
    next(error);
  }
});
