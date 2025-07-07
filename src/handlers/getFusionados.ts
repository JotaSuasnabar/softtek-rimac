import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PersonajeFusionado } from '../models/Mapeo';
import { getPersonajeStarWars, getObtenerPokemon } from '../services/api.service';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const historyTableName = process.env.FUSION_HISTORY_TABLE;

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    
    const [swapiResult, pokemonResult] = await Promise.all([
      getPersonajeStarWars(),
      getObtenerPokemon(),
    ]);
    
    const swapiData = swapiResult.data;
    const pokemonData = pokemonResult.data;

    const personajeFusionado: Omit<PersonajeFusionado, 'id' | 'recordType' | 'fechaCreacion'> = {
      swapiId: swapiResult.id,
      pokemonId: pokemonResult.id,
      personaje: {
        nombre: swapiData.name,
        altura: swapiData.height,
        peso: swapiData.mass,
        color_cabello: swapiData.hair_color,
        color_piel: swapiData.skin_color,
        color_ojos: swapiData.eye_color,
        nacimiento: swapiData.birth_year,
        genero: swapiData.gender,
      },
      pokemonCompanero: {
        nombre: pokemonData.name,
        altura: pokemonData.height,
        peso: pokemonData.weight,
        tipos: pokemonData.types.map((t: any) => t.type.name),
        habilidades: pokemonData.abilities.map((a: any) => a.ability.name),
      },
    };
    
    const historialItem: PersonajeFusionado = {
      id: uuidv4(),
      recordType: 'FUSION_HISTORY',
      fechaCreacion: new Date().toISOString(),
      ...personajeFusionado
    };

    await docClient.send(new PutCommand({
      TableName: historyTableName,
      Item: historialItem,
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personajeFusionado),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al fusionar o almacenar los datos.' }),
    };
  }
};