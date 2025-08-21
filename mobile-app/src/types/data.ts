/**
 * Represents a product category in the system.
 * Based on the CATEGORIA table in the ER diagram.
 */
export interface Category {
  id_categoria: number;
  nome: string;
  descrizione: string;
  attiva: boolean;
}

/**
 * Represents a product in the system.
 * Based on the PRODOTTO table in the ER diagram.
 */
export interface Product {
  id_prodotto: number;
  nome: string;
  descrizione: string;
  prezzo: number; // Storing decimal as number
  quantita_disponibile: number;
  categoria: string; // This could also be a nested Category object in a real API
  attivo: boolean;
  data_creazione: string; // ISO 8601 date string
}
