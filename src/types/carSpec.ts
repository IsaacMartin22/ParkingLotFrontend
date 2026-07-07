export type CarColor =
  | 'Red'
  | 'Blue'
  | 'Black'
  | 'White'
  | 'Silver'
  | 'Green';

export type CarMake =
  | 'Toyota'
  | 'Honda'
  | 'Ford'
  | 'Chevrolet'
  | 'Nissan'
  | 'Hyundai'
  | 'Kia'
  | 'Mazda'
  | 'Subaru'
  | 'Volkswagen'
  | 'BMW'
  | 'Mercedes-Benz';

export type CarModel =
  // Toyota
  | 'Corolla' | 'Camry' | 'RAV4' | 'Prius'
  // Honda
  | 'Civic' | 'Accord' | 'CR-V' | 'Pilot'
  // Ford
  | 'F-150' | 'Escape' | 'Explorer' | 'Mustang'
  // Chevrolet
  | 'Silverado' | 'Malibu' | 'Equinox' | 'Tahoe'
  // Nissan
  | 'Sentra' | 'Altima' | 'Rogue' | 'Pathfinder'
  // Hyundai
  | 'Elantra' | 'Sonata' | 'Tucson' | 'Santa Fe'
  // Kia
  | 'Forte' | 'K5' | 'Sportage' | 'Sorento'
  // Mazda
  | 'Mazda3' | 'Mazda6' | 'CX-5' | 'CX-9'
  // Subaru
  | 'Impreza' | 'Legacy' | 'Forester' | 'Outback'
  // Volkswagen
  | 'Jetta' | 'Passat' | 'Golf' | 'Tiguan'
  // BMW
  | '3 Series' | '5 Series' | 'X3' | 'X5'
  // Mercedes-Benz
  | 'C-Class' | 'E-Class' | 'GLC' | 'GLE';

export const CAR_COLORS: CarColor[] = [
  'Red', 'Blue', 'Black', 'White', 'Silver', 'Green',
];

export const CAR_MAKES_AND_MODELS: Record<CarMake, CarModel[]> = {
  Toyota:       ['Corolla', 'Camry', 'RAV4', 'Prius'],
  Honda:        ['Civic', 'Accord', 'CR-V', 'Pilot'],
  Ford:         ['F-150', 'Escape', 'Explorer', 'Mustang'],
  Chevrolet:    ['Silverado', 'Malibu', 'Equinox', 'Tahoe'],
  Nissan:       ['Sentra', 'Altima', 'Rogue', 'Pathfinder'],
  Hyundai:      ['Elantra', 'Sonata', 'Tucson', 'Santa Fe'],
  Kia:          ['Forte', 'K5', 'Sportage', 'Sorento'],
  Mazda:        ['Mazda3', 'Mazda6', 'CX-5', 'CX-9'],
  Subaru:       ['Impreza', 'Legacy', 'Forester', 'Outback'],
  Volkswagen:   ['Jetta', 'Passat', 'Golf', 'Tiguan'],
  BMW:          ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
};

export const CAR_MAKES: CarMake[] = Object.keys(CAR_MAKES_AND_MODELS) as CarMake[];

