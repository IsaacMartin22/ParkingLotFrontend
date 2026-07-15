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
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();
  const requestName = 'parkingLots';

  async function fetchParkingLotsWithAnalytics(): Promise<ParkingLotResponse[]> {
    const startedAt = Date.now();
    const result = await fetchParkingLots();
    postAnalyticsRequest(buildNetworkSuccessAnalyticsRequest(Date.now() - startedAt, requestName));
    return result;
  }

  return useQuery([requestName], fetchParkingLotsWithAnalytics, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
