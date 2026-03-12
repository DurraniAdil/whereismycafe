export interface Amenities {
  wifi: boolean;
  ac: boolean;
  outdoorSeating: boolean;
  powerOutlets: boolean;
  boardGames: boolean;
  parking: boolean;
}

export type Vibe = 'Study' | 'Chill' | 'Date' | 'Party' | 'Work' | 'Me Time';
export type NoiseLevel = 'Quiet' | 'Moderate' | 'Loud';
export type Lighting = 'Bright' | 'Warm' | 'Dim';
export type MusicType = 'None' | 'Lo-fi' | 'Bollywood' | 'Western' | 'Live';

export interface Cafe {
  id: string;
  name: string;
  area: string;
  zone?: string;
  address?: string;
  googleMapsUrl: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  instagram?: string;
  website?: string;
  openingHours: string;
  closedOn?: string;
  priceForTwo: number;
  cheapestItem?: string;
  popularItem?: string;
  rating?: number;
  vibes: Vibe[];
  noiseLevel: NoiseLevel;
  lighting: Lighting;
  music: MusicType;
  amenities: Amenities;
  description: string;
  photos: string[];
  isNewCafe: boolean;
  isTrending: boolean;
  addedOn: string;
  verified: boolean;
  googleRating: number;
  googleReviewCount: number;
  userRatingTotal: number;
  userReviewCount: number;
  displayRating: number;
  displayReviewCount: number;
}
export interface Review {
  _id: string;
  cafeId: string;
  cafeName?: string;
  anonymousId: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVisible: boolean;
}
