import { Acteur } from "./Acteur";
import { TypeActeur } from "./ActeurTypes";
import { Filiere } from "./Filiere";

export interface Continent {
    idContinent: string;
    codeContinent: string;
    nomContinent: string;
    descriptionContinent: string;
    statutContinent: boolean;
    dateAjout: string;
    dateModif: string | null;
}

export interface SousRegion {
    idSousRegion: string;
    codeSousRegion: string;
    nomSousRegion: string;
    statutSousRegion: boolean;
    dateAjout: string;
    dateModif: string | null;
    personneModif: string | null;
    hasAssociation: boolean;
    continent: Continent;
}

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

export interface Niveau1Pays {
    idNiveau1Pays: string;
    codeN1: string;
    nomN1: string;
    descriptionN1: string;
    statutN1: boolean;
    dateAjout: string;
    dateModif: string | null;
    hasAssociation: boolean;
    pays: Pays;
}

export interface CategorieProduit {
    idCategorieProduit: string;
    codeCategorie: string;
    libelleCategorie: string;
    descriptionCategorie: string;
    statutCategorie: boolean;
    personneModif: string | null;
    dateAjout: string;
    dateModif: string | null;
    hasAssociation: boolean;
    filiere: Filiere;
}




export interface MagasinDetail {
    idMagasin: string;
    codeMagasin: string;
    nomMagasin: string;
    latitude: string | null;
    longitude: string | null;
    localiteMagasin: string;
    contactMagasin: string;
    personneModif: string | null;
    statutMagasin: boolean;
    dateAjout: string;
    dateModif: string | null;
    photo: string | null;
    hasAssociation: boolean;
    pays: string;
    nbreView: number;
    acteur: Acteur;
    niveau1Pays: Niveau1Pays;
}
