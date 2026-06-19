import { useQuery } from '@tanstack/react-query';
import {Car, Floor} from '../types/parking';
import {toNumber} from "../formattingUtils";

const API_URL = 'http://localhost:8080/api';

function normalizeCar(car: any): Car | null {
  if (!car) {
    return null;
  }

  return {
    id: toNumber(car?.id ?? car?.carId) ?? 0,
    color: String(car?.color ?? ''),
    make: String(car?.make ?? ''),
    model: String(car?.model ?? ''),
    manufacturingYear: toNumber(car?.manufacturingYear ?? car?.year) ?? 0,
    licensePlate: String(car?.licensePlate ?? car?.plate ?? car?.plateNumber ?? ''),
  };
}

function normalizeSpace(space: any, index: number) {
  const id = toNumber(space?.id ?? space?.spaceId ?? space?.parkingSpaceId) ?? index + 1;
  const number = String(space?.number ?? space?.name ?? space?.label ?? space?.spaceNumber ?? `S-${index + 1}`);

  const car = normalizeCar(space?.car);
  const occupied = typeof space?.occupied === 'boolean'
      ? space.occupied
      : typeof space?.isOccupied === 'boolean'
          ? space.isOccupied
          : car !== null || String(space?.status || '').toUpperCase() === 'OCCUPIED';

  return {
    id,
    number,
    occupied,
    car,
  };
}

function normalizeSection(section: any, index: number) {
  const id = toNumber(section?.id ?? section?.sectionId) ?? index + 1;
  const name = String(section?.name ?? section?.sectionName ?? `Section ${index + 1}`);
  const spaces = Array.isArray(section?.spaces)
      ? section.spaces
      : Array.isArray(section?.parkingSpaces)
          ? section.parkingSpaces
          : Array.isArray(section?.slots)
              ? section.slots
              : [];

  return {
    id,
    name,
    spaces: spaces.map(normalizeSpace),
  };
}

function normalizeFloor(floor: any, fallbackFloorId: string): Floor {
  const id = toNumber(floor?.id ?? floor?.floorId) ?? toNumber(fallbackFloorId);
  const sections = Array.isArray(floor?.sections)
    ? floor.sections
    : Array.isArray(floor?.floorSections)
      ? floor.floorSections
      : [];

  return {
    id,
    name: String(floor?.name ?? floor?.floorName ?? `Floor ${id}`),
    capacity: toNumber(floor?.capacity ?? floor?.totalCapacity),
    available: toNumber(floor?.available ?? floor?.freeSpaces ?? floor?.totalFreeSpaces),
    sections: sections.map(normalizeSection),
  };
}

async function fetchParkingLotFloor(parkingLotId: string, floorId: string): Promise<Floor> {
  const res = await fetch(`${API_URL}/lots/${parkingLotId}/floors/${floorId}/details`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);

  const data: Floor = await res.json();
  return normalizeFloor(data, floorId);
}

export default function useFloorForParkingLot(parkingLotId: string, floorId: string) {
  return useQuery(
    ['parkingLotFloor', parkingLotId, floorId],
    () => fetchParkingLotFloor(parkingLotId, floorId),
    {
      enabled: parkingLotId !== undefined && parkingLotId !== null && floorId !== undefined && floorId !== null,
      staleTime: 30_000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
}
