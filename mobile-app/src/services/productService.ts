import { Product, Category } from '../types/data';

const MOCK_CATEGORIES: Category[] = [
  { id_categoria: 1, nome: 'Elettronica', descrizione: 'Dispositivi e accessori elettronici', attiva: true },
  { id_categoria: 2, nome: 'Libri', descrizione: 'Libri di vario genere', attiva: true },
  { id_categoria: 3, nome: 'Abbigliamento', descrizione: 'Vestiti e accessori moda', attiva: true },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id_prodotto: 101,
    nome: 'Smartphone Pro X',
    descrizione: 'Uno smartphone di ultima generazione con fotocamera da 108MP.',
    prezzo: 799.99,
    quantita_disponibile: 50,
    categoria: 'Elettronica',
    attivo: true,
    data_creazione: '2023-01-15T09:30:00Z',
  },
  {
    id_prodotto: 102,
    nome: 'Laptop Ultra-Slim',
    descrizione: 'Un laptop leggero e potente per la massima produttività.',
    prezzo: 1299.00,
    quantita_disponibile: 30,
    categoria: 'Elettronica',
    attivo: true,
    data_creazione: '2023-02-20T11:00:00Z',
  },
  {
    id_prodotto: 201,
    nome: 'Il Signore degli Anelli',
    descrizione: 'Edizione speciale con copertina rigida della famosa trilogia.',
    prezzo: 45.50,
    quantita_disponibile: 100,
    categoria: 'Libri',
    attivo: true,
    data_creazione: '2023-03-10T14:00:00Z',
  },
  {
    id_prodotto: 301,
    nome: 'T-Shirt in Cotone Organico',
    descrizione: 'Una t-shirt comoda e sostenibile, disponibile in vari colori.',
    prezzo: 25.00,
    quantita_disponibile: 200,
    categoria: 'Abbigliamento',
    attivo: true,
    data_creazione: '2023-04-05T16:45:00Z',
  },
];

/**
 * Mocks a backend API call to fetch all products.
 * @returns {Promise<Product[]>} A list of all products.
 */
export const getProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, 800); // Simulate network delay
  });
};

/**
 * Mocks a backend API call to fetch a single product by its ID.
 * @param {number} id - The ID of the product to fetch.
 * @returns {Promise<Product | undefined>} The product if found, otherwise undefined.
 */
export const getProductById = async (id: number): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_PRODUCTS.find((p) => p.id_prodotto === id);
      resolve(product);
    }, 500); // Simulate network delay
  });
};

/**
 * Mocks a backend API call to fetch all categories.
 * @returns {Promise<Category[]>} A list of all categories.
 */
export const getCategories = async (): Promise<Category[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_CATEGORIES);
        }, 600); // Simulate network delay
    });
};
