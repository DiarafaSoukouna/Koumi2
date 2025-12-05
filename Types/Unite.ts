import { Acteur } from "./Acteur";

export interface Unite {
    idUnite: string;
    codeUnite: string;
    nomUnite: string;
    sigleUnite: string;
    description: string;
    dateAjout: string;
    dateModif: string;
    statutUnite: boolean;
    personneModif: string | null;
    hasAssociation: boolean;
    acteur: Acteur;
}