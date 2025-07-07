import { handler } from '../../src/handlers/getFusionados';
import * as apiService from '../../src/services/api.service';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { Pokemon, SwapiPerson } from '../../src/models/Api';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';

jest.mock('../../src/services/api.service');
const mockedApiService = apiService as jest.Mocked<typeof apiService>;
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Prueba de Integración para getFusionados', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    ddbMock.reset();
  });

  test('Debe llamar a los servicios, fusionar y guardar los datos', async () => {

    const mockSwapiData: SwapiPerson = { name: 'Luke Skywalker', height: '172', mass: '77', hair_color: 'blond', skin_color: 'fair', eye_color: 'blue', birth_year: '19BBY', gender: 'male' };
    const mockPokemonData: Pokemon = { name: 'Pikachu', height: 4, weight: 60, types: [{ type: { name: 'electric' } }], abilities: [{ ability: { name: 'static' } }] };
    const mockSwapiResult = { id: 1, data: mockSwapiData };
    const mockPokemonResult = { id: 25, data: mockPokemonData };

    mockedApiService.getPersonajeStarWars.mockResolvedValue(mockSwapiResult);
    mockedApiService.getObtenerPokemon.mockResolvedValue(mockPokemonResult);
    ddbMock.on(PutCommand).resolves({});

    const event = {} as APIGatewayProxyEventV2;
    const context = {} as Context;
    const callback = () => {};

    const result = await handler(event, context, callback) as { body: string; statusCode: number };
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(mockedApiService.getPersonajeStarWars).toHaveBeenCalledTimes(1);
    expect(mockedApiService.getObtenerPokemon).toHaveBeenCalledTimes(1);
    expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
  });
});