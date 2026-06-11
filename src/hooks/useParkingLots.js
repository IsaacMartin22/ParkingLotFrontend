import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.REACT_APP_PARKING_API_URL || 'http://localhost:8080/api';

async function fetchParkingLots() {
  const res = await fetch(API_URL+"/lots");
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const data = await res.json();
  // Support either an array response or an object with a `lots` array
  return Array.isArray(data) ? data : data.lots || [];
}

export default function useParkingLots() {
  return useQuery(['parkingLots'], fetchParkingLots, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

