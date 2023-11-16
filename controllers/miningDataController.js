/* eslint-disable import/newline-after-import */
const fs = require('fs');
const AppError = require('./../utils/appError');
const {
  validateMiningHardwareData,
  miningDataCache
} = require('../models/miningHardwareModel');
// Middleware for catching async errors
const catchAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create operation
exports.createOne = catchAsync(async (req, res, next) => {
  const miningData = req.body;
  miningData.id = miningDataCache.keys().length + 1;

  // Validate the data against the schema
  const validataResult = validateMiningHardwareData(miningData);
  if (validataResult.error) {
    return next(new AppError(validataResult.error.message, 400));
  }

  // Generate a unique ID (you might want to use a more robust solution)

  // Store the data in the cache
  miningDataCache.set(miningData.id, miningData);

  res.status(201).json({
    status: 'success',
    data: miningData
  });
});

// Read operation
exports.getOne = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  // Retrieve data from the cache
  const miningData = miningDataCache.get(id);

  if (!miningData) {
    return next(new AppError('No mining data found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: miningData
  });
});

// Update operation
exports.updateOne = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const newData = req.body;

  // Retrieve existing data from the cache
  const existingMiningData = miningDataCache.get(id);

  if (!existingMiningData) {
    return next(new AppError('No mining data found with that ID', 404));
  }

  // Validate the new data against the schema
  validateMiningHardwareData(newData);

  // Update the existing data with the new data
  const updatedMiningData = { ...existingMiningData, ...newData };

  // Store the updated data in the cache
  miningDataCache.set(id, updatedMiningData);

  res.status(200).json({
    status: 'success',
    data: updatedMiningData
  });
});

// Delete operation
exports.deleteOne = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  // Delete data from the cache
  const deletedMiningData = miningDataCache.take(id);
  if (!deletedMiningData) {
    return next(new AppError('No mining data found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  // Get all keys from the cache
  const allKeys = miningDataCache.keys();

  // Retrieve data for each key
  const allData = allKeys.map(key => miningDataCache.get(key));

  res.status(200).json({
    status: 'success',
    data: allData
  });
});
exports.batchInsertMiningHardwareData = filePath => {
  try {
    // Read the JSON file
    const data = fs.readFileSync(filePath);
    const miningHardwareDataList = JSON.parse(data);

    // Validate and insert each mining hardware data into the cache
    miningHardwareDataList.forEach(miningHardwareData => {
      try {
        // Validate the data against the schema
        validateMiningHardwareData(miningHardwareData);
        // Insert the validated data into the cache

        miningDataCache.set(miningHardwareData.id, miningHardwareData);
      } catch (error) {
        console.log('error', error);
      }
    });
  } catch (readFileError) {
    console.error('Error reading file:', readFileError);
  }
};
