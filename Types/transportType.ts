import { Acteur } from "./Acteur";
import { Monnaie } from "./monnaie";
import { Pays } from "./pays";
import { TypeVoiture } from "./TypeVoiture";

export interface Vehicule {
    idVehicule: string;
    nomVehicule: string;
    capaciteVehicule: string;
    codeVehicule: string;
    description: string;
    nbKilometrage: number;
    hasAssociation: boolean;
    prixParDestination: { [key: string]: number };
    statutVehicule: boolean;
    pays: string;
    photoVehicule: string;
    localisation: string;
    dateAjout: string;
    dateModif: string | null;
    etatVehicule: string;
    personneModif: string | null;
    nbreView: number;
    acteur: Acteur;
    typeVoiture: TypeVoiture;
    monnaie: Monnaie;
}
interface DestinationPrice {
    destination: string;
    price: string;
}

export interface CreateVehiculeData {
    nomVehicule: string;
    capaciteVehicule: string;
    codeVehicule: string;
    description: string;
    prixParDestination: { [key: string]: number };
    pays: string;
    photoVehicule: string;
    localisation: string;
    etatVehicule: string;
    personneModif: string | null;
    nbreView: number;
    // acteur: Acteur;
    acteur: { idActeur: string }
    typeVoiture: TypeVoiture;
    monnaie: Monnaie;
}

// Types/transportType.ts
export interface TransporteurContextType {
    // États pour les données
    vehicules: Vehicule[];
    typeVoitures: TypeVoiture[];
    monnaies: Monnaie[];

    // États de chargement
    loadingVehicules: boolean;

    // États d'erreur
    errorVehicules: string | null;

    // Fonctions de récupération
    fetchVehicules: () => Promise<void>;
    fetchTypeVoitures: () => Promise<void>;
    fetchMonnaies: () => Promise<void>;

    // Fonctions de création
    createVehicule: (data: CreateVehiculeData) => Promise<void>;

    // Fonctions de mise à jour
    updateVehicule: (id: string, data: Partial<CreateVehiculeData>) => Promise<void>;

    // Fonctions de suppression
    deleteVehicule: (id: string) => Promise<void>;

    // Réinitialisation des erreurs
    clearErrors: () => void;

    // Pays
    pays: Pays[];
    fetchPays: () => Promise<void>;
}