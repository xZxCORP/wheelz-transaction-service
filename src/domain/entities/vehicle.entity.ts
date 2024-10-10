export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  description: string;
  coordinates: Coordinates;
}

export interface Sinister {
  date: Date;
  type: string;
  severity: string;
  primaryFactor: string;
  injuryType: string;
  collisionType: string;
  isWeekend: boolean;
  location: Location;
}

export interface Vehicle {
  vin: string;
  constructorName: string;
  model: string;
  year: number;
  risks: {
    exterior: string[];
    mechanical: string[];
    generic: string[];
  };
  sinisters: Sinister[];
  issues: {
    exterior: string[];
    mechanical: string[];
    generic: string[];
  };
}
