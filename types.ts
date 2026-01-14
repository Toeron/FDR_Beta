
export type Genre = 'Metal' | 'Hardrock' | 'Thrash' | 'Death Metal' | 'Black Metal' | 'Doom' | 'All';

export interface Record {
  id: string;
  artist: string;
  title: string;
  genre: Genre;
  price: number | 'Upon Request' | 'Sold Out';
  condition: string;
  imageUrls: string[];
  stockCount: number;
  buyLink: string;
  tracklist?: string;
  notes?: string;
  catalogNumber?: string;
  year?: string;
  format?: string;
  isFeatured?: boolean;
}

export interface CartItem extends Record {
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  genre?: Genre;
}
