import GConnect from './GConnect/client';
import Axios from 'axios';
import { DynamoDB } from 'aws-sdk';
import { MonthlyMaxHrCollection } from './Entities/MonthlyMaxHr';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import UpdateItemInput = DocumentClient.UpdateItemInput;

export const importMaxHr = async () => {
  const client = new GConnect(Axios);
  const docClient = new DynamoDB.DocumentClient();
  const maxHrData: MonthlyMaxHrCollection = await client.getMaxHrData();
  for (const item of maxHrData.toArray()) {
    const param: UpdateItemInput = {
      TableName: 'maxhr',
      Key: {
        date: item.date,
      },
      UpdateExpression: 'SET maxHr = :maxHr',
      ExpressionAttributeValues: {
        ':maxHr': item.maxHr,
      },
    };

    await docClient.update(param).promise();
  }
};
