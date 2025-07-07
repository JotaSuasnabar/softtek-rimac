import { handler } from '../../src/handlers/postAlmacenar';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Prueba de Integración para postAlmacenar', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  test('Debe guardar los datos y devolver un 201 si el cuerpo es válido', async () => {
    ddbMock.on(PutCommand).resolves({});
    const validBody = { nombre: "Dato de prueba", prioridad: "media", valor: 99 };
    const event = { body: JSON.stringify(validBody) } as APIGatewayProxyEventV2;
    const context = {} as Context;
    const callback = () => {};

    const result = await handler(event, context, callback) as { body: string; statusCode: number };
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(201);
    expect(body).toHaveProperty('id');
  });

  test('Debe devolver un 400 si el cuerpo no es válido', async () => {
    const invalidBody = { nombre: "no" };
    const event = { body: JSON.stringify(invalidBody) } as APIGatewayProxyEventV2;
    const context = {} as Context;
    const callback = () => {};

    const result = await handler(event, context, callback) as { body: string; statusCode: number };
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(body.message).toBe('Datos inválidos.');
  });
});