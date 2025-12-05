import { Acteur } from "./Acteur";
import { CategorieProduit } from "./CategorieProduits";
import { Forme } from "./forme";
import { Monnaie } from "./monnaie";


export interface Intrant {
    idIntrant: string;
    nomIntrant: string;
    quantiteIntrant: number;
    codeIntrant: string;
    prixIntrant: number;
    descriptionIntrant: string;
    photoIntrant: string;
    statutIntrant: boolean;
    dateExpiration: string | null;
    dateAjout: string;
    dateModif: string | null;
    personneModif: string | null;
    pays: string;
    hasAssociation: boolean;
    unite: string;
    nbreView: number;
    categorieProduit: CategorieProduit;
    forme: Forme;
    acteur: Acteur;
    monnaie: Monnaie | null;
}

// Type pour un tableau d'intrants
export type IntrantList = Intrant[];

export interface CreateIntrantData {
    nomIntrant: string;
    quantiteIntrant: number;
    codeIntrant: string;
    prixIntrant: number;
    descriptionIntrant: string;
    photoIntrant: string;
    statutIntrant: boolean;
    dateExpiration: string | null;
    pays: string;
    unite: string;
    categorieProduit: { idCategorieProduit: string };
    forme: { idForme: string };
    acteur: { idActeur: string };
    monnaie: { idMonnaie: string } | null;
}

export interface UpdateIntrantData {
    nomIntrant: string;
    quantiteIntrant: number;
    codeIntrant: string;
    prixIntrant: number;
    descriptionIntrant: string;
    photoIntrant: string;
    statutIntrant: boolean;
    dateExpiration: string | null;
    pays: string;
    unite: string;
    categorieProduit: { idCategorieProduit: string };
    forme: { idForme: string };
    acteur: { idActeur: string };
    monnaie: { idMonnaie: string } | null;
}

export interface IntrantContextTypes {
    intrantList: Intrant[];
    loading: boolean;
    error: string | null;
    loadingByActeur: boolean;
    errorByActeur: string | null;
    fetchIntrant: () => Promise<void>;
    createIntrant: (data: CreateIntrantData) => Promise<void>;
    updateIntrant: (id: string, data: UpdateIntrantData) => Promise<void>;
    deleteIntrant: (id: string) => Promise<void>;
    getAllByActeur: () => Promise<void>;
    fetchMonnaies: () => Promise<void>;
    monnaies: Monnaie[];
    loadingMonnaies: boolean;
    errorMonnaies: string | null;
    fetchCategories: () => Promise<void>;
    categories: CategorieProduit[];
    loadingCategories: boolean;
    errorCategories: string | null;
    fetchFormes: () => Promise<void>;
    formes: Forme[];
    loadingFormes: boolean;
    errorFormes: string | null;
}