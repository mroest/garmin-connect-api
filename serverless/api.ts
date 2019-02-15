import { DynamoDB } from 'aws-sdk';

export function heartrate(event, context, callback) {
  handler(getMaxHr, callback);
}

export function distance(event, context, callback) {
  handler(getDistance, callback);
}

export function duration(event, context, callback) {
  handler(getDuration, callback);
}

export function steps(event, context, callback) {
  handler(getSteps, callback);
}

export function wellness(event, context, callback) {
  handler(getWellness, callback);
}

const handler = async (itemCaller: () => Promise<any>, callbackHandler) => {
  try {
    const items = await itemCaller();
    callbackHandler(null, {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    callbackHandler(error.message, {
      statusCode: 500,
      body: JSON.stringify(error.message),
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

const getMaxHr = async () => {
  const dbClient = new DynamoDB.DocumentClient();
  return dbClient.scan({ TableName: 'maxhr' }).promise();
};

const getDistance = async () => {
  const dbClient = new DynamoDB.DocumentClient();
  return dbClient.scan({ TableName: 'distance' }).promise();
};

const getDuration = async () => {
  const dbClient = new DynamoDB.DocumentClient();
  return dbClient.scan({ TableName: 'duration' }).promise();
};

const getSteps = async () => {
  const dbClient = new DynamoDB.DocumentClient();
  return dbClient.scan({ TableName: 'steps' }).promise();
};

const getWellness = async () => {
  const dbClient = new DynamoDB.DocumentClient();
  return dbClient.scan({ TableName: 'wellness' }).promise();
};
