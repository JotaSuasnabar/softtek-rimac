import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const customDataSchema = z.object({
  nombre: z.string().min(3, "Tu nombre"),
  prioridad: z.enum(['alta', 'media', 'baja']),
  valor: z.number(),
});

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.CUSTOM_DATA_TABLE;

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ message: 'El cuerpo de la solicitud está vacío.' }) };
    }
    
    const data = JSON.parse(event.body);
    const validatedData = customDataSchema.parse(data);
    
    const item = {
      id: uuidv4(),
      ...validatedData
    };

    await docClient.send(new PutCommand({
        TableName: tableName,
        Item: item,
    }));

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Datos inválidos.',
          errors: error.format(),
        }),
      };
    }
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor.' }),
    };
  }
};