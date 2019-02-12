import { DynamoDB } from 'aws-sdk';

export async function heartrate(event, context, callback) {
  await handler(getMaxHr, callback);
}

export async function distance(event, context, callback) {
  await handler(getDistance, callback);
}

export async function duration(event, context, callback) {
  await handler(getDuration, callback);
}

export async function steps(event, context, callback) {
  await handler(getSteps, callback);
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
