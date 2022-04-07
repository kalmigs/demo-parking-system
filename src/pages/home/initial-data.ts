import { nanoid } from 'nanoid';
import { carData, spaceData } from './data-types';

export const initSpaces: spaceData[] = [
  {
    id: nanoid(),
    size: 0,
    distance: [2, 4, 5],
  },
  {
    id: nanoid(),
    size: 1,
    distance: [3, 2, 3],
  },
  {
    id: nanoid(),
    size: 2,
    distance: [1, 3, 5],
  },
  {
    id: nanoid(),
    size: 1,
    distance: [4, 5, 6],
  },
];

export const initCars: carData[] = [
  {
    id: nanoid(),
    size: 0,
  },
  {
    id: nanoid(),
    size: 1,
  },
  {
    id: nanoid(),
    size: 2,
  },
];
