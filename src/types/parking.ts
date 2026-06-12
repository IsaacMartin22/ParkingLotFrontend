export interface Level {
  id: number;
  name: string;
  capacity?: number;
  available?: number;
}

export interface ParkingLot {
  id: number;
  name: string;
  address: string;
  totalCapacity: number;
  totalFreeSpaces: number;
  type: string;
  levelIds: number[];
}
