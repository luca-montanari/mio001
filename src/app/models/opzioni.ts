export const NOME_DELLA_COLLEZIONE_OPZIONI = 'opzioni'

export interface Opzioni {
    columns: Colonna[];
}

export interface Colonna {
    id: string;
    title: string;
}
