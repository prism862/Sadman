export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  sizes: string[];
  isSpectrum?: boolean;
  spectrumImage?: string;
  offer?: number; // percentage off
  stockCount?: number;
  isOutOfStock?: boolean;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryArea: 'Inside Chittagong' | 'Outside Chittagong';
  deliveryFee: number;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
}
