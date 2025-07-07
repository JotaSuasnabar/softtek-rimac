import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.FUSION_HISTORY_TABLE;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const limit = event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit, 10) : 10;
    const lastKey = event.queryStringParameters?.nextToken;

    const params: QueryCommandInput = {
      TableName: tableName,
      IndexName: 'ChronologicalIndex',
      KeyConditionExpression: 'recordType = :recordType',
      ExpressionAttributeValues: {
        ':recordType': 'FUSION_HISTORY',
      },
      Limit: limit,
      ScanIndexForward: false,
    };

    if (lastKey) {
      params.ExclusiveStartKey = JSON.parse(Buffer.from(lastKey, 'base64').toString('utf8'));
    }

    const { Items, LastEvaluatedKey } = await docClient.send(new QueryCommand(params));
    
    let nextToken = null;
    if (LastEvaluatedKey) {
      nextToken = Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64');
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: Items ?? [],
        nextToken: nextToken,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al obtener el historial.', error }),
    };
  }
};