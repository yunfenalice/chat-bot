const { z } = require('zod');
const NodeCache = require('node-cache');
const miningDataCache = new NodeCache();

// Define a schema for miningHardwareModel
const miningHardwareModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
  hashRate: z.string()
});

function validateMiningHardwareData(miningHardwareData) {
  return miningHardwareModelSchema.safeParse(miningHardwareData);
}

module.exports = {
  validateMiningHardwareData,
  miningHardwareModelSchema,
  miningDataCache
};
