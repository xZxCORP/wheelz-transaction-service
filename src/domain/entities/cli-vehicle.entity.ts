export interface RawVehicle {
  constructor: string;
  model: string;
  year: number;
  risks: { exterior: string[]; mechanical: string[]; generic: string[] };
  sinisters: Array<{
    'Year': number;
    'Month': number;
    'Day': number;
    'Weekend?': string;
    'Hour': number;
    'Collision Type': string;
    'Injury Type': string;
    'Primary Factor': string;
    'Reported_Location': string;
    'Latitude': number;
    'Longitude': number;
  }>;
  vin: string;
  issues: { exterior: string[]; mechanical: string[]; generic: string[] };
}
