import { SousRegion } from "./SousRegion";

export interface Pays {
    idPays: string;
    codePays: string;
    nomPays: string;
    libelleNiveau1Pays: string;
    libelleNiveau2Pays: string;
    libelleNiveau3Pays: string;
    monnaie: string;
    descriptionPays: string;
    whattsAppPays: string;
    personneModif: string | null;
    statutPays: boolean;
    dateAjout: string;
    dateModif: string | null;
    sousRegion: SousRegion;
}