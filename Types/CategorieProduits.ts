import { Filiere } from "./Filiere";

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