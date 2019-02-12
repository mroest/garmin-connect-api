import GConnect from './GConnect/client';
import Axios from 'axios';
import { DynamoDB } from 'aws-sdk';
import { MonthlyRestHrCollection } from './Entities/MonthlyRestHr';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import UpdateItemInput = DocumentClient.UpdateItemInput;

export const importRestHr = async () => {
  const client = new GConnect(Axios);
  const docClient = new DynamoDB.DocumentClient();
  const restHrData: MonthlyRestHrCollection = await client.getMonthlyRestHr();
  for (const item of restHrData.toArray()) {
    const param: UpdateItemInput = {
      TableName: 'maxhr',
      Key: {
        date: item.date,
      },
      UpdateExpression: 'SET restHr = :restHr',
      ExpressionAttributeValues: {
        ':restHr': item.restHr,
      },
    };

    await docClient.update(param).promise();
  }
};
