const router = require('express').Router();

const {getTrends, getWoeid} = require('../Controllers/TrendController')

router.get('/', getTrends);
router.get("/near-me", getWoeid);

module.exports = router