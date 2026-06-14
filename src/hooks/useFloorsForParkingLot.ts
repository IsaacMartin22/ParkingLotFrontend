import { useQuery } from '@tanstack/react-query';
import { Level } from '../types/parking';

const API_URL = 'http://localhost:8080/api';

function validateFloor(floor: Level): Level {
  if (!floor.id || !floor.name) {
    throw new Error(`Invalid floor data: missing required fields in ${JSON.stringify(floor)}`);
  }

  return floor;
}

async function fetchFloorsForParkingLot(parkingLotId: number | string): Promise<Level[]> {
  const res = await fetch(`${API_URL}/lots/${parkingLotId}/floors`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);

  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    throw new Error('API response must be an array of floors');
  }

  return data.map(validateFloor);
}

export default function useFloorsForParkingLot(parkingLotId?: number | string) {
  return useQuery(
    ['parkingLotFloors', parkingLotId],
    () => fetchFloorsForParkingLot(parkingLotId as number | string),
    {
      enabled: parkingLotId !== undefined && parkingLotId !== null && parkingLotId !== '',
      staleTime: 30_000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
}
