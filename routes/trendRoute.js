const router = require('express').Router();

const {getTrends} = require('../Controllers/TrendController')

router.post('/', getTrends);

module.exports = router