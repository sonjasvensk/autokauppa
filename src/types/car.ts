export interface Car {
  id?: number;
  brand: string;
  model: string;
  color: string;
  fuel: string;
  modelYear: number;
  price: number;
}

export interface ApiResponse {
  _embedded: {
    cars: Car[];
  };
}
