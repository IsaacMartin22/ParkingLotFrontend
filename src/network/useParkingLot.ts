import { useQuery } from '@tanstack/react-query';
import { ParkingLotResponse } from '../types/parking';
import {API_URL} from "../types/constants";
import usePostAnalyticsRequest from './usePostAnalyticsRequest';
import { buildNetworkSuccessAnalyticsRequest } from './analyticsNetwork';

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
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();

  async function fetchParkingLotWithAnalytics(): Promise<ParkingLotResponse> {
    const startedAt = Date.now();
    const result = await fetchParkingLot(parkingLotId);
    postAnalyticsRequest(buildNetworkSuccessAnalyticsRequest(Date.now() - startedAt));
    return result;
  }

  return useQuery(
    ['parkingLot', parkingLotId],
    fetchParkingLotWithAnalytics,
    {
      enabled: parkingLotId !== undefined && parkingLotId !== null,
      staleTime: 30_000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
}
