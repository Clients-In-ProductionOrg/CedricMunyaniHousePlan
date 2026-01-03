export interface FloorRoom {
  name: string;
  quantity: number;
}

export interface Floor {
  number: number;
  name: string;
  rooms: FloorRoom[];
}

export interface HousePlanImage {
  id: number;
  image: string;
  title: string;
  order: number;
}

export interface HousePlan {
  id: number;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  square_feet: number;
  width_meters: number;
  depth_meters: number;
  style: string;
  description?: string;
  primary_image?: string;
  images: HousePlanImage[];
  is_popular: boolean;
  is_best_selling: boolean;
  is_new: boolean;
  is_pet_friendly: boolean;
  status?: string;
  features?: string[];
  videoUrl?: string;
  amenities?: string[];
  floors?: Floor[];
}

export interface FilterState {
  bedrooms?: number[];
  bathrooms?: number[];
  levels?: number[];
  garage?: number[];
  styles?: string[];
  priceMin?: number;
  priceMax?: number;
  floorAreaMin?: number;
  floorAreaMax?: number;
}

export type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low' | 'popular';
