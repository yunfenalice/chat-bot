/* eslint-disable import/newline-after-import */
const fs = require('fs');
const AppError = require('../utils/appError');
const {
  calculateExpectedHashes,
  calculatePercentAchieved,
  calculateExpectedBitcoins,
  calculateExpectedHashrate
} = require('../utils/analysis');
const { miningDataCache } = require('../models/miningHardwareModel');

const rawData = fs.readFileSync(
  './dev-data/data/mining-statistics-data.json',
  'utf-8'
);
const stats = JSON.parse(rawData);
// Middleware for catching async errors
const catchAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
exports.getStats = catchAsync(async (req, res, next) => {
  // Retrieve data from the cache
  if (!stats) {
    return next(new AppError('No Stats data', 404));
  }

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

exports.getAnalysis = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  // Retrieve data from the cache
  const hardwareData = miningDataCache.get(id);

  if (!hardwareData) {
    return next(new AppError('No mining data found with that ID', 404));
  }
  // Retrieve data for each key
  try {
    const { actualBitcoins, miningDifficulty } = req.query;

    // expectedHashes
    const expectedHashes = calculateExpectedHashes(hardwareData.hashRate);
    // expectedBitcoins
    const expectedBitcoins = calculateExpectedBitcoins(expectedHashes);
    const percentAchieved = calculatePercentAchieved(
      actualBitcoins,
      expectedBitcoins
    );
    const expectedHashrate = calculateExpectedHashrate(
      actualBitcoins,
      miningDifficulty
    );
    res.status(200).json({
      status: 'success',
      data: {
        expectedHashes,
        expectedBitcoins,
        percentAchieved,
        expectedHashrate
      }
    });
  } catch (error) {
    console.error('Error during analysis:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
