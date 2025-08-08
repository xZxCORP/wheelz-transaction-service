import { describe, expect, it, vi } from 'vitest';

vi.mock('@zcorp/shared-typing-wheelz', () => ({
  vehicleSchema: {
    safeParseAsync: vi.fn(async (input) => ({ success: true, data: input })),
  },
}));

import type { RawVehicleInfos } from '../../domain/entities/cli-vehicle.entity.js';
import { MapRawVehicleToVehicleUseCase } from './map-raw-vehicle-to-vehicle.use-case.js';
import { vehicleSchema } from '@zcorp/shared-typing-wheelz';

describe('MapRawVehicleToVehicleUseCase', () => {
  it('maps raw vehicle to domain vehicle and normalizes -99 to null (AAA)', async () => {
    // Arrange
    const sut = new MapRawVehicleToVehicleUseCase();
    const raw: RawVehicleInfos = {
      vehicule: {
        caracteristiques: {
          marque: 'CITROEN',
          nomCommercial: 'C3',
          puissanceCv: 5,
          couleur: 'VERT',
          tvv: 'TVV',
          numCnit: 'CNIT',
          typeReception: 'CE',
          vin: 'VIN1',
          champF1: 1200,
          champF2: 1200,
          champF3: 1500,
          champG: 1000,
          champG1: 900,
          categorie: 'M1',
          genre: 'VP',
          carrosserieCe: 'AB',
          carrosserieNationale: 'CI',
          numeroReception: 'REC',
          cylindree: 1200,
          puissanceNette: 55,
          energie: 'ES',
          nbPlacesAssises: 5,
          nbPlacesDebout: -99,
          niveauSonore: 80,
          vitesseMoteur: 3000,
          co2: 120,
          pollution: 'E5',
          rapportPuissMasse: -99,
        },
        infos: {
          nbTitulaires: 1,
          datePremiereImmatriculationFrance: '2020-01-01',
          datePremiereImmatSiv: '2020-01-01',
          plaqueImmatriculation: 'AA-123-BB',
          dateConvertionSiv: null,
        },
        infosImport: {
          datePremiereImmatEtranger: null,
          dateImportFrance: null,
          isImported: false,
          immatriculationOrigine: null,
          codePaysOrigine: null,
          nomPaysOrigine: null,
        },
        usage: { listeDesUsages: [], isAgricole: false, isCollection: false },
        situationAdmin: {
          isApteACirculer: true,
          isCiAnnule: false,
          dateAnnulation: null,
          isCiVole: false,
          isDuplicata: false,
          gages: { hasGages: false, informations: [] },
          isCiPerdu: false,
          dvs: { hasDvs: false, informations: [] },
          suspensions: { hasSuspensions: false, informations: [] },
          oppositions: {
            hasOppositions: false,
            informations: { oves: [], oveis: [], otcisPv: [], otcis: [] },
          },
          isVehVole: false,
        },
        accidents: { nbSinistres: 0, dateDerniereResolution: null, dateDernierSinistre: null },
        historique: [
          { opaDate: '2020-01-01', opaType: "Première immatriculation d'un véhicule neuf" },
        ],
      },
      proprietaire: {
        personnePhysique: { nomNaissance: 'DOE', prenom: 'JOHN' },
        personneMorale: { raisonSociale: '', siren: '' },
        codePostal: '75000',
      },
      certificatImmatriculation: { age: 1, dateEmission: '2020-01-01' },
      utac: {
        updateDate: '2024-11-12',
        status: 200,
        ct: [
          {
            ctDate: '2020-06-01',
            resultat: 'Favorable',
            resultatRaw: 'A',
            nature: 'CTP',
            km: 10_000,
          },
        ],
      },
      clefAcheteur: 'key',
      validiteClefAcheteur: '2024-12-12',
      messageUsager: '',
      plaqImmatHash: 'hash',
      dateMiseAJour: '2024-11-02',
    };

    // Act
    const result = await sut.execute(raw);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.vin).toBe('VIN1');
    expect(result!.features.standingPlacesNumber).toBeNull();
  });

  it('returns null when schema validation fails (AAA)', async () => {
    // Arrange
    (vehicleSchema.safeParseAsync as any).mockResolvedValueOnce({ success: false });
    const sut = new MapRawVehicleToVehicleUseCase();
    const raw: RawVehicleInfos = {
      vehicule: {
        caracteristiques: {
          marque: 'CITROEN',
          nomCommercial: 'C3',
          puissanceCv: 5,
          couleur: 'VERT',
          tvv: 'TVV',
          numCnit: 'CNIT',
          typeReception: 'CE',
          vin: 'VIN1',
          champF1: 1200,
          champF2: 1200,
          champF3: 1500,
          champG: 1000,
          champG1: 900,
          categorie: 'M1',
          genre: 'VP',
          carrosserieCe: 'AB',
          carrosserieNationale: 'CI',
          numeroReception: 'REC',
          cylindree: 1200,
          puissanceNette: 55,
          energie: 'ES',
          nbPlacesAssises: 5,
          nbPlacesDebout: -99,
          niveauSonore: 80,
          vitesseMoteur: 3000,
          co2: 120,
          pollution: 'E5',
          rapportPuissMasse: -99,
        },
        infos: {
          nbTitulaires: 1,
          datePremiereImmatriculationFrance: '2020-01-01',
          datePremiereImmatSiv: '2020-01-01',
          plaqueImmatriculation: 'AA-123-BB',
          dateConvertionSiv: null,
        },
        infosImport: {
          datePremiereImmatEtranger: null,
          dateImportFrance: null,
          isImported: false,
          immatriculationOrigine: null,
          codePaysOrigine: null,
          nomPaysOrigine: null,
        },
        usage: { listeDesUsages: [], isAgricole: false, isCollection: false },
        situationAdmin: {
          isApteACirculer: true,
          isCiAnnule: false,
          dateAnnulation: null,
          isCiVole: false,
          isDuplicata: false,
          gages: { hasGages: false, informations: [] },
          isCiPerdu: false,
          dvs: { hasDvs: false, informations: [] },
          suspensions: { hasSuspensions: false, informations: [] },
          oppositions: {
            hasOppositions: false,
            informations: { oves: [], oveis: [], otcisPv: [], otcis: [] },
          },
          isVehVole: false,
        },
        accidents: { nbSinistres: 0, dateDerniereResolution: null, dateDernierSinistre: null },
        historique: [
          { opaDate: '2020-01-01', opaType: "Première immatriculation d'un véhicule neuf" },
        ],
      },
      proprietaire: {
        personnePhysique: { nomNaissance: 'DOE', prenom: 'JOHN' },
        personneMorale: { raisonSociale: '', siren: '' },
        codePostal: '75000',
      },
      certificatImmatriculation: { age: 1, dateEmission: '2020-01-01' },
      utac: {
        updateDate: '2024-11-12',
        status: 200,
        ct: [
          {
            ctDate: '2020-06-01',
            resultat: 'Favorable',
            resultatRaw: 'A',
            nature: 'CTP',
            km: 10_000,
          },
        ],
      },
      clefAcheteur: 'key',
      validiteClefAcheteur: '2024-12-12',
      messageUsager: '',
      plaqImmatHash: 'hash',
      dateMiseAJour: '2024-11-02',
    };

    // Act
    const result = await sut.execute(raw);

    // Assert
    expect(result).toBeNull();
  });
});
