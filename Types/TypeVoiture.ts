import { Acteur } from "./Acteur";

export interface TypeVoiture {
    idTypeVoiture: string;
    codeTypeVoiture: string;
    nom: string;
    nombreSieges: number;
    description: string;
    dateAjout: string;
    dateModif: string | null;
    statutType: boolean;
    acteur: Acteur;
}
