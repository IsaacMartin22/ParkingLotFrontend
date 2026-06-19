export interface Floor {
  id: number;
  name: string;
  capacity?: number;
  available?: number;
  sections?: FloorSection[];
}

export interface FloorSection {
  id: number;
  name: string;
  spaces: ParkingSpace[];
}

export interface ParkingSpace {
  id: number;
  name: string;
  occupied: boolean;
  carColor?: string;
  licensePlate?: string;
  parkedSince?: string;
}

export interface ParkingLotResponse {
  id: number;
  name: string;
  address: string;
  totalCapacity: number;
  totalFreeSpaces: number;
  type: string;
  floorIds: number[];
}

export interface ParkingLot extends ParkingLotResponse {
  floors?: Floor[];
}