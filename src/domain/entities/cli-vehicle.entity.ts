export interface RawVehicleInfos {
  vehicule: Vehicule;
  proprietaire: Proprietaire;
  certificatImmatriculation: CertificatImmatriculation;
  utac: Utac;
  clefAcheteur: string;
  validiteClefAcheteur: Date;
  messageUsager: string;
  plaqImmatHash: string;
  incomingQuery: IncomingQuery;
  dateMiseAJour: Date;
}

export interface CertificatImmatriculation {
  age: number;
  dateEmission: Date;
}

export interface IncomingQuery {
  SivPhysique: SivPhysique;
}

export interface SivPhysique {
  nom: string;
  prenom: string;
  immat: string;
  numeroFormule: string;
}

export interface Proprietaire {
  personnePhysique: PersonnePhysique;
  personneMorale: PersonneMorale;
  codePostal: string;
}

export interface PersonneMorale {
  raisonSociale: string;
  siren: string;
}

export interface PersonnePhysique {
  nomNaissance: string;
  prenom: string;
}

export interface Utac {
  updateDate: Date;
  status: number;
  ct: CT[];
}

export interface CT {
  ctDate: Date;
  resultat: string;
  resultatRaw: string;
  nature: string;
  km: number;
}

export interface Vehicule {
  caracteristiques: Caracteristiques;
  infos: Infos;
  infosImport: InfosImport;
  usage: Usage;
  situationAdmin: SituationAdmin;
  accidents: Accidents;
  historique: Historique[];
}

export interface Accidents {
  nbSinistres: number;
  dateDerniereResolution: null;
  dateDernierSinistre: null;
}

export interface Caracteristiques {
  marque: string;
  nomCommercial: string;
  puissanceCv: number;
  couleur: string;
  tvv: string;
  numCnit: string;
  typeReception: string;
  vin: string;
  champF1: number;
  champF2: number;
  champF3: number;
  champG: number;
  champG1: number;
  categorie: string;
  genre: string;
  carrosserieCe: string;
  carrosserieNationale: string;
  numeroReception: string;
  cylindree: number;
  puissanceNette: number;
  energie: string;
  nbPlacesAssises: number;
  nbPlacesDebout: number;
  niveauSonore: number;
  vitesseMoteur: number;
  co2: number;
  pollution: string;
  rapportPuissMasse: number;
}

export interface Historique {
  opaDate: Date;
  opaType: string;
}

export interface Infos {
  nbTitulaires: number;
  datePremiereImmatriculationFrance: Date;
  datePremiereImmatSiv: Date;
  plaqueImmatriculation: string;
  dateConvertionSiv: Date;
}

export interface InfosImport {
  datePremiereImmatEtranger: null;
  dateImportFrance: null;
  isImported: boolean;
  immatriculationOrigine: null;
  codePaysOrigine: null;
  nomPaysOrigine: null;
}

export interface SituationAdmin {
  isApteACirculer: boolean;
  isCiAnnule: boolean;
  dateAnnulation: null;
  isCiVole: boolean;
  isDuplicata: boolean;
  gages: Gages;
  isCiPerdu: boolean;
  dvs: Dvs;
  suspensions: Suspensions;
  oppositions: Oppositions;
  isVehVole: boolean;
}

export interface Dvs {
  hasDvs: boolean;
  informations: any[];
}

export interface Gages {
  hasGages: boolean;
  informations: any[];
}

export interface Oppositions {
  hasOppositions: boolean;
  informations: Informations;
}

export interface Informations {
  oves: any[];
  oveis: any[];
  otcisPv: any[];
  otcis: any[];
}

export interface Suspensions {
  hasSuspensions: boolean;
  informations: any[];
}

export interface Usage {
  listeDesUsages: any[];
  isAgricole: boolean;
  isCollection: boolean;
}
