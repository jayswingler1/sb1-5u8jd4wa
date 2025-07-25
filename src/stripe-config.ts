export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'prod_SkNgUsI9Zm25Kk',
    priceId: 'price_1Rosuk70zwhtlHUxxZOzOze6',
    name: 'Servine',
    description: '',
    price: 1.00,
    mode: 'payment'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};