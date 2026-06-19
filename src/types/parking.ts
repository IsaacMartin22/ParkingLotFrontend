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

export interface Car {
  id: number;
  color: string;
  make: string;
  model: string;
  manufacturingYear: number;
  licensePlate: string;
}

export interface ParkingSpace {
  id: number;
  number: string;
  occupied: boolean;
  car: Car | null;
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