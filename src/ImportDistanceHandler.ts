import GConnect from './GConnect/client';
import Axios from 'axios';
import { DynamoDB } from 'aws-sdk';
import { MonthlyDistanceCollection } from './Entities/MonthlyDistance';

export const importDistance = async () => {
  const client = new GConnect(Axios);
  const docClient = new DynamoDB.DocumentClient();
  const distanceCollection: MonthlyDistanceCollection = await client.getMonthlyDistance();
  for (const item of distanceCollection.toArray()) {
    const param = {
      TableName: 'distance',
      Item: {
        date: item.date,
        distance: item.distance,
        activities: item.activities,
      },
    };
    await docClient.put(param).promise();
  }
};
