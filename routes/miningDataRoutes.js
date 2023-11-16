const express = require('express');
const miningDataController = require('../controllers/miningDataController');

const router = express.Router({ mergeParams: true });
router.get('/stats', miningDataController.getStats);
router.get('/analysis/:id', miningDataController.getAnalysis);
router
  .route('/')
  .get(miningDataController.getAll)
  .post(miningDataController.createOne);

router
  .route('/:id')
  .get(miningDataController.getOne)
  .patch(miningDataController.updateOne)
  .delete(miningDataController.deleteOne);

module.exports = router;
