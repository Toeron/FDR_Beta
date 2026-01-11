
export type Genre = 'Metal' | 'Hardrock' | 'Thrash' | 'Death Metal' | 'Black Metal' | 'Doom' | 'All';

export interface Record {
  id: string;
  artist: string;
  title: string;
  genre: Genre;
<<<<<<< HEAD
  price: number | 'Upon Request' | 'Sold Out';
=======
  price: number | 'Upon Request';
>>>>>>> origin/main
  condition: string;
  imageUrls: string[];
  stockCount: number;
  buyLink: string;
  tracklist?: string;
  notes?: string;
  catalogNumber?: string;
}

export interface CartItem extends Record {
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  genre?: Genre;
}
