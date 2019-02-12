import GConnect from './GConnect/client';
import Axios from 'axios';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { WeeklySleepDurationCollection } from './Entities/Wellness';
import UpdateItemInput = DocumentClient.UpdateItemInput;

export const importSleepDuration = async () => {
  const client = new GConnect(Axios);
  const docClient = new DynamoDB.DocumentClient();
  const sleepDurationData: WeeklySleepDurationCollection = await client.getWeeklySleepDuration();
  for (const item of sleepDurationData.toArray()) {
    const param: UpdateItemInput = {
      TableName: 'wellness',
      Key: {
        date: item.date,
      },
      UpdateExpression: 'SET sleep = :sleep',
      ExpressionAttributeValues: {
        ':sleep': item.sleep,
      },
    };

    await docClient.update(param).promise();
  }
};
