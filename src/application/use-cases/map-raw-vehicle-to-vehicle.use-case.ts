import { type Vehicle, vehicleSchema } from '@zcorp/shared-typing-wheelz';

import type { RawVehicleInfos } from '../../domain/entities/cli-vehicle.entity.js';

export class MapRawVehicleToVehicleUseCase {
  constructor() {}

  async execute(rawVehicle: RawVehicleInfos): Promise<Vehicle | null> {
    const data: Vehicle = {
      vin: rawVehicle.vehicule.caracteristiques.vin,
      features: {
        brand: rawVehicle.vehicule.caracteristiques.marque,
        model: rawVehicle.vehicule.caracteristiques.nomCommercial,
        cvPower: rawVehicle.vehicule.caracteristiques.puissanceCv,
        color: rawVehicle.vehicule.caracteristiques.couleur,
        tvv: rawVehicle.vehicule.caracteristiques.tvv,
        cnitNumber: rawVehicle.vehicule.caracteristiques.numCnit,
        receptionType: rawVehicle.vehicule.caracteristiques.typeReception,
        technicallyAdmissiblePTAC: rawVehicle.vehicule.caracteristiques.champF1,
        ptac: rawVehicle.vehicule.caracteristiques.champF2,
        ptra: this.nullOrValue(rawVehicle.vehicule.caracteristiques.champF3),
        ptService: rawVehicle.vehicule.caracteristiques.champG,
        ptav: rawVehicle.vehicule.caracteristiques.champG1,
        category: rawVehicle.vehicule.caracteristiques.categorie,
        gender: rawVehicle.vehicule.caracteristiques.genre,
        ceBody: rawVehicle.vehicule.caracteristiques.carrosserieCe,
        nationalBody: rawVehicle.vehicule.caracteristiques.carrosserieNationale,
        receptionNumber: rawVehicle.vehicule.caracteristiques.numeroReception,
        displacement: rawVehicle.vehicule.caracteristiques.cylindree,
        netPower: rawVehicle.vehicule.caracteristiques.puissanceNette,
        energy: rawVehicle.vehicule.caracteristiques.energie,
        seatingNumber: rawVehicle.vehicule.caracteristiques.nbPlacesAssises,
        standingPlacesNumber: this.nullOrValue(rawVehicle.vehicule.caracteristiques.nbPlacesDebout),
        sonorousPowerLevel: rawVehicle.vehicule.caracteristiques.niveauSonore,
        engineSpeed: rawVehicle.vehicule.caracteristiques.vitesseMoteur,
        co2Emission: this.nullOrValue(rawVehicle.vehicule.caracteristiques.co2),
        pollutionCode: rawVehicle.vehicule.caracteristiques.pollution,
        powerMassRatio: this.nullOrValue(rawVehicle.vehicule.caracteristiques.rapportPuissMasse),
      },
      infos: {
        holderCount: rawVehicle.vehicule.infos.nbTitulaires,
        firstRegistrationInFranceDate: rawVehicle.vehicule.infos.datePremiereImmatriculationFrance,
        firstSivRegistrationDate: rawVehicle.vehicule.infos.datePremiereImmatSiv,
        licensePlate: rawVehicle.incomingQuery.SivPhysique.immat,
        sivConversionDate: rawVehicle.vehicule.infos.dateConvertionSiv,
      },
      history: rawVehicle.vehicule.historique.map((historyItem) => ({
        date: historyItem.opaDate,
        type: historyItem.opaType,
      })),
      technicalControls: rawVehicle.utac.ct.map((technicalControlItem) => ({
        date: technicalControlItem.ctDate,
        result: technicalControlItem.resultat,
        resultRaw: technicalControlItem.resultatRaw,
        nature: technicalControlItem.nature,
        km: technicalControlItem.km,
      })),
      sinisterInfos: {
        count: rawVehicle.vehicule.accidents.nbSinistres,
        lastResolutionDate: rawVehicle.vehicule.accidents.dateDerniereResolution,
        lastSinisterDate: rawVehicle.vehicule.accidents.dateDernierSinistre,
      },
    };
    const result = await vehicleSchema.safeParseAsync(data);
    return result.success ? result.data : null;
  }
  private nullOrValue(value: any): any {
    return value === -99 ? null : value;
  }
}
