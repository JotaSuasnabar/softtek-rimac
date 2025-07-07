import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import axios from 'axios';
import { SwapiPerson, Pokemon } from '../models/Api';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const cacheTableName = process.env.API_CACHE_TABLE;

const fetchAndCache = async <T>(id: number, keyPrefix: string, apiCallFn: (id: number) => Promise<T>): Promise<{ id: number; data: T }> => {
    const cacheKey = `${keyPrefix}:${id}`;

    const cacheResult = await docClient.send(new GetCommand({ TableName: cacheTableName, Key: { cacheKey } }));

    if (cacheResult.Item) {
        console.log(`Desde CACHE para ${cacheKey}`);
        return { id, data: cacheResult.Item.data as T };
    }

    console.log(`Desde API para ${cacheKey}. Llamando a la API externa.`);
    const data = await apiCallFn(id);

    const expirationTime = Math.floor(Date.now() / 1000) + (30 * 60);
    await docClient.send(new PutCommand({ TableName: cacheTableName, Item: { cacheKey, data, expirationTime } }));

    return { id, data };
};

export const getPersonajeStarWars = async (): Promise<{ id: number; data: SwapiPerson }> => {
    const randomId = Math.floor(Math.random() * 82) + 1;
    const swapiApiCall = (id: number): Promise<SwapiPerson> => 
        axios.get<SwapiPerson>(`https://swapi.py4e.com/api/people/${id}/`).then(res => res.data);
    
    return fetchAndCache<SwapiPerson>(randomId, 'swapi', swapiApiCall);
};

export const getObtenerPokemon = async (): Promise<{ id: number; data: Pokemon }> => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const pokemonApiCall = (id: number): Promise<Pokemon> => 
        axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.data);

    return fetchAndCache<Pokemon>(randomId, 'pokemon', pokemonApiCall);
};