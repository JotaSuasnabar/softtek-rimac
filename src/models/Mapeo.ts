export interface PersonajeFusionado {
    id: string;
    recordType: string;
    fechaCreacion: string;
    swapiId: number;
    pokemonId: number;
    personaje: {
        nombre: string;
        altura: string;
        peso: string;
        color_cabello: string;
        color_piel: string;
        color_ojos: string;
        nacimiento: string;
        genero: string;
    };
    pokemonCompanero: {
        nombre: string;
        altura: number;
        peso: number;
        tipos: string[];
        habilidades: string[];
    };
}

export interface DatoPersonalizado {
    id: string;
    [key: string]: any;
}