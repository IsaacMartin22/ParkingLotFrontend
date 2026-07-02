export interface Floor {
  id: number;
  name: string;
  capacity: number;
  totalFreeSpaces: number;
  sections?: FloorSection[];
}

export interface FloorSection {
  id: number;
  name: string;
  spaces: ParkingSpaceResponse[];
}

export interface ParkingSpaceResponse {
  id: number;
  number: string;
  occupied: boolean;
  sectionId: number;
  color?: string;
  make?: string;
  model?: string;
  manufacturingYear?: number;
  licensePlate?: string;
}

export interface ParkingLotResponse {
  id: number;
  name: string;
  address: string;
  totalCapacity: number;
  totalFreeSpaces: number;
  type: string;
  floorIds: number[];
  floors: Floor[];
}