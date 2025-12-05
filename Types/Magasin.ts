import { Acteur } from "./Acteur";
import { Niveau1Pays } from "./Niveau1Pays";

export interface Magasin {
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
    photo: string;
    hasAssociation: boolean;
    pays: string;
    nbreView: number;
    acteur: Acteur;
    niveau1Pays: Niveau1Pays;
}
