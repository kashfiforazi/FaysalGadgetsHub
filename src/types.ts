export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  img: string;
  stock?: number;
  rating: number;
  reviewsCount?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin';
}
