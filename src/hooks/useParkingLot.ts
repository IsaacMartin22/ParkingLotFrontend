import { useQuery } from '@tanstack/react-query';
import { ParkingLotResponse } from '../types/parking';

const API_URL = 'http://localhost:8080/api';

function validateLot(lot: ParkingLotResponse): ParkingLotResponse {
  if (!lot.id || !lot.name || !lot.totalCapacity || lot.totalFreeSpaces === undefined || !lot.floorIds) {
    throw new Error(`Invalid parking lot data: missing required fields in ${JSON.stringify(lot)}`);
  }

  return lot;
}

async function fetchParkingLot(parkingLotId: string): Promise<ParkingLotResponse> {
  const res = await fetch(`${API_URL}/lots/${parkingLotId}`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);

  const data: ParkingLotResponse = await res.json();
  return validateLot(data);
}

export default function useParkingLot(parkingLotId?: string) {
  return useQuery(
    ['parkingLot', parkingLotId],
    () => fetchParkingLot(parkingLotId),
    {
      enabled: parkingLotId !== undefined && parkingLotId !== null,
      staleTime: 30_000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
}
