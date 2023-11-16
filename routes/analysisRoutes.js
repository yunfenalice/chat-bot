const express = require('express');
const analysisController = require('../controllers/analysisController');

const router = express.Router({ mergeParams: true });

router.route('/').get(analysisController.getStats);

router.route('/:id').get(analysisController.getAnalysis);

module.exports = router;
