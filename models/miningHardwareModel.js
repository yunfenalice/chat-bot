const { z } = require('zod');

// Define a schema for miningHardwareModel
const miningHardwareModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
  hashRate: z.string()
});

function validateMiningHardwareData(miningHardwareData) {
  try {
    const validatedMiningHardware = miningHardwareModelSchema.parse(
      miningHardwareData
    );
    console.log('Valid Mining Hardware:', validatedMiningHardware);
  } catch (error) {
    console.error('Validation Error:', error);
  }
}

module.exports = {
  validateMiningHardwareData,
  miningHardwareModelSchema
};
