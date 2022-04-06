
export type size = 0 | 1 | 2;

export interface carData {
  id: string;
  size: size;
  parkedSince?: number;
  leftSince?: number;
}

export interface spaceData {
  id: string;
  size: size;
  distance: number[];
  parkedCar?: carData;
}