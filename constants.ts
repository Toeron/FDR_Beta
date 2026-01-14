
import { Genre } from './types';

export const GENRES: Genre[] = ['All', 'Metal', 'Hardrock', 'Thrash', 'Death Metal', 'Black Metal', 'Doom'];

/**
 * Access the Google Sheet CSV URL from environment variables.
 * In your Render.com Dashboard, set VITE_GOOGLE_SHEET_CSV_URL to your spreadsheet link.
 * The App will automatically normalize it to a CSV export format.
 */
// This variable is only for local development. In production, we use the Netlify Function proxy.
export const GOOGLE_SHEET_CSV_URL = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL || '';

export const MOCK_RECORDS = [
  {
    id: '1',
    artist: 'Metallica',
    title: "Live in '89 (The Justice Tour)",
    genre: 'Thrash' as Genre,
    price: 35.00,
    condition: 'Mint',
    imageUrls: ['https://picsum.photos/seed/metallica/600/600'],
    stockCount: 2,
    buyLink: 'mailto:Kips1963@gmail.com?subject=Order: Metallica - Live in 89'
  }
];
