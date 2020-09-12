export interface SLADetails {
  timeToMitigate: number
  mitigationEfficiency: number
  serviceAvailability: number
  compensationPercentages: number[]
  violationThresholds: number[]
}
export enum SettingsKey {
  SLACONTRACTS = "slaContracts",
  MONITORS = "monitors",
}
export interface SLAContract {
  service: Service
  web3ContractInstance: any
  state?: State
  validityObject?: ValidityObject
  monitorAddress?: string
}
export interface State {
  isActivated: boolean
  isTerminated: boolean
  currentCompensation: number
  violationCount: number
}

export interface ValidityObject {
  createdAt: number
  expiresAt: number
  validity: number
}

export interface Service {
  serviceName: string
  providerName: string
  customerAddress?: string
  providerAddress: string
  monitorAddress?: string
  description: string
  price: number // in ETH
  validityPeriod: number // in days
  paymentTransactionHash?: string // hash of payment transaction to SLA.sol invoked by customer
  registrationHash?: string // hash of transaction registering with Kirti.sol
  slaContractAddress?: string // address of the associated SLA contract
  ratingDb?: string // address of the DB which includes all ratings of this service
  slaDetails: SLADetails
}

export interface SLA {
  serviceName: string
  providerName: string
  customerAddress: string
  providerAddress: string
  monitorAddress: string
  description: string
  price: number // in ETH
  validityPeriod: number // in days
  slaDetails: SLADetails
}

export interface OrbitDBService {
  uniqueId: string
  service: Service
}

export interface OrbitDBCustomer {
  address: string
  services: Service[]
}

export interface ServiceProvider {
  address: string
  name: string
  registrationHash: string // hash of transaction registering with the SC
  serviceFeedAddress: string
  rating: number // should obviously be more elaborate
}

export interface MasterRating {
  customerRating: CustomerRating
  // violationReport: TODO ... to be defined
}

export interface CustomerRating {
  customerAddress: string
  serviceName: string
  registrationHash?: string // hash of transaction registering with Kirti.sol
  paymentHash?: string // this is the hash of the tx where the customer paid the SC
  ratingScore: RatingScore
}

export interface RatingScore {
  accurracy: number
  usability: number
  pricing: number
  support: number
  features: number
  ratingText: string
}
