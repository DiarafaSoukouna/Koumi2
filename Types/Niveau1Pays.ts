import { Pays } from "./pays";

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