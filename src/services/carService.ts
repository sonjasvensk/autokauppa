import type { Car, ApiResponse } from '../types/car';

const API_BASE_URL = 'https://car-rest-service-carshop.2.rahtiapp.fi';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export async function getCars(): Promise<Car[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`);
    const data: ApiResponse = await handleResponse(response);
    return data._embedded.cars.map((car: any) => ({
      id: extractIdFromLink(car._links.self.href),
      brand: car.brand,
      model: car.model,
      color: car.color,
      fuel: car.fuel,
      modelYear: car.modelYear,
      price: car.price,
    }));
  } catch (error) {
    console.error('Failed to fetch cars:', error);
    throw error;
  }
}

export async function addCar(car: Omit<Car, 'id'>): Promise<Car> {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
    const data = await handleResponse(response);
    return {
      id: extractIdFromLink(data._links.self.href),
      ...data,
    };
  } catch (error) {
    console.error('Failed to add car:', error);
    throw error;
  }
}

export async function updateCar(id: number, car: Omit<Car, 'id'>): Promise<Car> {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
    const data = await handleResponse(response);
    return {
      id,
      ...data,
    };
  } catch (error) {
    console.error('Failed to update car:', error);
    throw error;
  }
}

export async function deleteCar(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  } catch (error) {
    console.error('Failed to delete car:', error);
    throw error;
  }
}

function extractIdFromLink(href: string): number {
  const parts = href.split('/');
  return parseInt(parts[parts.length - 1], 10);
}
