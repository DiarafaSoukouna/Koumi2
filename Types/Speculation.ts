import { CategorieProduit } from "./CategorieProduits";

export interface Speculation {
    idSpeculation: string;
    codeSpeculation: string;
    nomSpeculation: string;
    descriptionSpeculation: string;
    statutSpeculation: boolean;
    categorieProduit: CategorieProduit;
    hasAssociation: boolean;
    dateAjout: string;
    dateModif: string | null;
    personneModif: string | null;
}