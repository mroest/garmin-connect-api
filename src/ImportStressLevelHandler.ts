import GConnect from './GConnect/client';
import Axios from 'axios';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { WeeklyStressLevelCollection } from './Entities/Wellness';
import UpdateItemInput = DocumentClient.UpdateItemInput;

export const importStressLevel = async () => {
  const client = new GConnect(Axios);
  const docClient = new DynamoDB.DocumentClient();
  const stressLevelData: WeeklyStressLevelCollection = await client.getWeeklyStressLevel();
  for (const item of stressLevelData.toArray()) {
    const param: UpdateItemInput = {
      TableName: 'wellness',
      Key: {
        date: item.date,
      },
      UpdateExpression: 'SET stressLevel = :stressLevel',
      ExpressionAttributeValues: {
        ':stressLevel': item.stressLevel,
      },
    };

    await docClient.update(param).promise();
  }
};
