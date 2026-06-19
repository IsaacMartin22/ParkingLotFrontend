export interface CapacityInfo {
  capacity: number;
  occupied: number;
  available: number;
  percentFull: number;
}

export function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value);
  }

  return undefined;
}

export function getCapacityInfo(capacityValue?: number, vacant?: number): CapacityInfo {
  const capacity = capacityValue ?? 0;
  const available = vacant ?? 0;
  const occupied = Math.max(0, capacity - available);
  const percentFull = capacity === 0 ? 0 : Math.round((occupied / capacity) * 100);

  return {
    capacity,
    occupied,
    available,
    percentFull,
  };
}

export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export function formatElapsedSince(value?: string): string {
  if (!value) return 'N/A';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'N/A';

  return formatDuration(Math.max(0, Date.now() - date.getTime()));
}

export function formatTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString();
}
