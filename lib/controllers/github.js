const { Router } = require('express');
const router = Router();

module.exports = router.get('/', async (req, res) => {
  res.json();
});
