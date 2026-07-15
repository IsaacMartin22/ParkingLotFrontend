import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import { CAR_COLORS, CAR_MAKES, CAR_MAKES_AND_MODELS, CarMake } from '../types/carSpec';
import usePostAnalyticsRequest from './usePostAnalyticsRequest';
import { buildNetworkSuccessAnalyticsRequest } from './analyticsNetwork';

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomLicensePlate(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const randomLetters = Array.from({ length: 3 }, () => randomFrom(letters.split(''))).join('');
  const randomDigits = Array.from({ length: 4 }, () => randomFrom(digits.split(''))).join('');
  return `${randomLetters}-${randomDigits}`;
}

function randomManufacturingYear(): number {
  const currentYear = new Date().getFullYear();
  return Math.floor(Math.random() * (currentYear - 2000 + 1)) + 2000;
}

function buildRandomCarSpec() {
  const make = randomFrom(CAR_MAKES) as CarMake;
  const model = randomFrom(CAR_MAKES_AND_MODELS[make]);
  const color = randomFrom(CAR_COLORS);
  const manufacturingYear = randomManufacturingYear();
  const licensePlate = randomLicensePlate();
  return { make, model, color, manufacturingYear, licensePlate };
}

async function addCarToSpace(spaceId: number): Promise<void> {
  const carSpec = buildRandomCarSpec();
  const res = await fetch(`${API_URL}/spaces/${spaceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carSpec),
  });
  if (!res.ok) throw new Error(`Failed to add car: API responded with ${res.status}`);
}

async function removeCarFromSpace(spaceId: number): Promise<void> {
  const res = await fetch(`${API_URL}/spaces/${spaceId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to remove car: API responded with ${res.status}`);
}

export function useAddCar() {
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();
  const requestName = 'addCar';

  return useMutation(async (spaceId: number) => {
    const startedAt = Date.now();
    await addCarToSpace(spaceId);
    postAnalyticsRequest(buildNetworkSuccessAnalyticsRequest(Date.now() - startedAt, requestName));
  });
}

export function useRemoveCar() {
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();
  const requestName = 'removeCar';

  return useMutation(async (spaceId: number) => {
    const startedAt = Date.now();
    await removeCarFromSpace(spaceId);
    postAnalyticsRequest(buildNetworkSuccessAnalyticsRequest(Date.now() - startedAt, requestName));
  });
}
