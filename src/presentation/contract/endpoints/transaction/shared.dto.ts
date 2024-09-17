import { Float, Int32, String } from '@airtasker/spot'

/** Coordinates of a location */
export interface Coordinates {
  /** Latitude of the location */
  latitude: Float
  /** Longitude of the location */
  longitude: Float
}

/** Location details */
export interface Location {
  /** Description of the location */
  description: String
  /** Coordinates of the location */
  coordinates: Coordinates
}

/** Details of a sinister event */
export interface Sinister {
  /** Date of the sinister event */
  date: String
  /** Type of the sinister event */
  type: String
  /** Severity of the sinister event */
  severity: String
  /** Primary factor of the sinister event */
  primaryFactor: String
  /** Type of injury in the sinister event */
  injuryType: String
  /** Type of collision in the sinister event */
  collisionType: String
  /** Whether the sinister event occurred on a weekend */
  isWeekend: boolean
  /** Location of the sinister event */
  location: Location
}

/** Structure for risks and issues */
export interface RiskIssueStructure {
  /** Exterior risks or issues */
  exterior: String[]
  /** Mechanical risks or issues */
  mechanical: String[]
  /** Generic risks or issues */
  generic: String[]
}

/** Vehicle details */
export interface Vehicle {
  /** Vehicle Identification Number */
  vin: String
  /** Name of the vehicle constructor */
  constructorName: String
  /** Model of the vehicle */
  model: String
  /** Year of manufacture of the vehicle */
  year: Int32
  /** Risks associated with the vehicle */
  risks: RiskIssueStructure
  /** Sinister events associated with the vehicle */
  sinisters: Sinister[]
  /** Issues associated with the vehicle */
  issues: RiskIssueStructure
}

/** Data signature structure */
export interface DataSignature {
  /** Signature of the data */
  signature: String
  /** Algorithm used for signing */
  algorithm: String
}

/** Transaction response structure */
export interface TransactionResponse {
  /** Timestamp of the transaction */
  timestamp: String
  /** Type of action: create, update, or delete */
  action: 'create' | 'update' | 'delete'
  /** Transaction data */
  data: Vehicle | UpdateTransactionData | DeleteTransactionData
  /** Data signature */
  dataSignature: DataSignature
}

/** Data for updating an existing transaction */
export interface UpdateTransactionData {
  /** VIN of the vehicle to be updated */
  vin: String
  /** Changes to be applied to the vehicle */
  changes: {
    /** Updated constructor name */
    constructorName?: String
    /** Updated model */
    model?: String
    /** Updated year of manufacture */
    year?: Int32
    /** Updated risks */
    risks?: RiskIssueStructure
    /** Updated list of sinister events */
    sinisters?: Sinister[]
    /** Updated issues */
    issues?: RiskIssueStructure
  }
}

/** Data for deleting an existing transaction */
export interface DeleteTransactionData {
  /** VIN of the vehicle to be deleted */
  vin: String
}
