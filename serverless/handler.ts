import { importMaxHr } from '../src/ImportMaxHrHandler';
import { importDistance } from '../src/ImportDistanceHandler';
import { importDuration } from '../src/ImportDurationHandler';
import { importSteps } from '../src/ImportStepsHandler';
import { importRestHr } from '../src/ImportRestHrHandler';
import { importSleepDuration } from '../src/ImportSleepDurationHandler';
import { importStressLevel } from '../src/ImportStressLevelHandler';

export const heartRate = async (event, context, callback) => {
  try {
    await importMaxHr();
    callback(null, { statusCode: 200, body: 'OK' });
  } catch (error) {
    callback(error.message);
  }
};

export const restHr = async (event, context, callback) => {
  try {
    await importRestHr();
    callback(null, { statusCode: 200, body: 'OK' });
  } catch (error) {
    callback(error.message);
  }
};

export const distance = async (event, context, callback) => {
  try {
    await importDistance();
    callback(null, { statusCode: 200, body: 'OK' });
  } catch (error) {
    callback(error.message);
  }
};

export const duration = async (event, context, callback) => {
  try {
    await importDuration();
    callback(null, { statusCode: 200, body: 'OK' });
  } catch (error) {
    callback(error.message);
  }
};

export const steps = async (event, context, callback) => {
  try {
    await importSteps();
    callback(null, { statusCode: 200, body: 'OK' });
  } catch (error) {
    callback(error.message);
  }
};

export const sleep = async (event, context, callback) => {
  try {
    await importSleepDuration();
    callback(null, { statusCode: 200, body: 'OK' });
  } catch (error) {
    callback(error.message);
  }
};

export const stress = async (event, context, callback) => {
  try {
    await importStressLevel();
    callback(null, { statusCode: 200, body: 'OK' });
  } catch (error) {
    callback(error.message);
  }
};
