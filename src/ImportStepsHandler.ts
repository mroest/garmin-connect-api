import GConnect from './GConnect/client';
import Axios from 'axios';
import { DynamoDB } from 'aws-sdk';
import { MonthlyStepsCollection } from './Entities/MonthlySteps';

export const importSteps = async () => {
  const client = new GConnect(Axios);
  const docClient = new DynamoDB.DocumentClient();
  const stepsCollection: MonthlyStepsCollection = await client.getMonthlySteps();
  for (const item of stepsCollection.toArray()) {
    const param = {
      TableName: 'steps',
      Item: {
        date: item.date,
        steps: item.steps,
      },
    };
    await docClient.put(param).promise();
  }
};
