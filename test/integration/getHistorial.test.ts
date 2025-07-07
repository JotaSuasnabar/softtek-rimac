import { handler } from '../../src/handlers/getHistorial';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Prueba de Integración para getHistorial', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  test('Debe devolver el historial con paginación', async () => {
    const mockItems = [{ id: '123', fechaCreacion: new Date().toISOString() }];
    const mockLastKey = { id: 'abc' };

    ddbMock.on(QueryCommand).resolves({
      Items: mockItems,
      LastEvaluatedKey: mockLastKey,
    });

    const event = { queryStringParameters: {} } as APIGatewayProxyEventV2;
    const context = {} as Context;
    const callback = () => {}; // Función vacía

    const result = await handler(event, context, callback) as { body: string; statusCode: number };
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.items).toEqual(mockItems);
    expect(body.nextToken).toBeDefined();
  });

  test('Debe manejar errores de base de datos', async () => {

    ddbMock.on(QueryCommand).rejects(new Error('DynamoDB error'));
    const event = {} as APIGatewayProxyEventV2;
    const context = {} as Context;
    const callback = () => {};

    const result = await handler(event, context, callback) as { body: string; statusCode: number };
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(500);
    expect(body.message).toContain('Error al obtener el historial.');
  });
});