import { useQuery } from '@tanstack/react-query';
import { ParkingLotResponse } from '../types/parking';

const API_URL = 'http://localhost:8080/api';

function validateLot(lot: ParkingLotResponse): ParkingLotResponse {
  if (!lot.id || !lot.name || !lot.totalCapacity || lot.totalFreeSpaces === undefined || !lot.floorIds) {
    throw new Error(`Invalid parking lot data: missing required fields in ${JSON.stringify(lot)}`);
  }

  return lot;
}

async function fetchParkingLots(): Promise<ParkingLotResponse[]> {
  const res = await fetch(`${API_URL}/lots`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    throw new Error('API response must be an array of parking lots');
  }

  return data.map(validateLot);
}

export default function useListParkingLots() {
  return useQuery(['parkingLots'], fetchParkingLots, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

