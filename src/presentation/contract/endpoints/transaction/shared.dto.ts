import { Float, Int32, String } from '@airtasker/spot'

/** Coordinates of a location */
export interface Coordinates {
  /** Latitude of the location
   * @default 40.7128
   */
  latitude: Float
  /** Longitude of the location
   * @default -74.006
   */
  longitude: Float
}

/** Location details */
export interface Location {
  /** Description of the location
   * @default "Main St and 1st Ave"
   */
  description: String
  /** Coordinates of the location */
  coordinates: Coordinates
}

/** Details of a sinister event */
export interface Sinister {
  /** Date of the sinister event
   * @default "2023-01-01"
   */
  date: String
  /** Type of the sinister event
   * @default "collision"
   */
  type: String
  /** Severity of the sinister event
   * @default "minor"
   */
  severity: String
  /** Primary factor of the sinister event
   * @default "distraction"
   */
  primaryFactor: String
  /** Type of injury in the sinister event
   * @default "none"
   */
  injuryType: String
  /** Type of collision in the sinister event
   * @default "rear_end"
   */
  collisionType: String
  /** Whether the sinister event occurred on a weekend
   * @default false
   */
  isWeekend: boolean
  /** Location of the sinister event */
  location: Location
}

/** Structure for risks and issues */
export interface RiskIssueStructure {
  /** Exterior risks or issues
   * @default ["minor_scratch"]
   */
  exterior: String[]
  /** Mechanical risks or issues
   * @default []
   */
  mechanical: String[]
  /** Generic risks or issues
   * @default ["high_mileage"]
   */
  generic: String[]
}

/** Vehicle details */
export interface Vehicle {
  /** Vehicle Identification Number
   * @default "ABCDEFGHIJKLMNOPQ"
   */
  vin: String
  /** Name of the vehicle constructor
   * @default "Toyota"
   */
  constructorName: String
  /** Model of the vehicle
   * @default "Corolla"
   */
  model: String
  /** Year of manufacture of the vehicle
   * @default 2022
   */
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
  /** Signature of the data
   * @default "validSignature123"
   */
  signature: String
  /** Algorithm used for signing
   * @default "ECDSA-SHA256"
   */
  signAlgorithm: String
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
  /** VIN of the vehicle to be updated
   * @default "ABCDEFGHIJKLMNOPQ"
   */
  vin: String
  /** Changes to be applied to the vehicle */
  changes: {
    /** Updated constructor name
     * @default "Toyota"
     */
    constructorName?: String
    /** Updated model
     * @default "Corolla"
     */
    model?: String
    /** Updated year of manufacture
     * @default 2022
     */
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
  /** VIN of the vehicle to be deleted
   * @default "ABCDEFGHIJKLMNOPQ"
   */
  vin: String
}
