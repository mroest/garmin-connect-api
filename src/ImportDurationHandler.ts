import GConnect from './GConnect/client';
import Axios from 'axios';
import { DynamoDB } from 'aws-sdk';
import { MonthlyDurationCollection } from './Entities/MonthlyDuration';

export const importDuration = async () => {
  const client = new GConnect(Axios);
  const docClient = new DynamoDB.DocumentClient();
  const durationCollection: MonthlyDurationCollection = await client.getMonthlyDuration();
  for (const item of durationCollection.toArray()) {
    const param = {
      TableName: 'duration',
      Item: {
        date: item.date,
        duration: item.duration,
        activities: item.activities,
      },
    };
    await docClient.put(param).promise();
  }
};
