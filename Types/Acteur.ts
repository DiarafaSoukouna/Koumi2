import { TypeActeur } from "./ActeurTypes";
import { Speculation } from "./Speculation";

export interface Acteur {
    idActeur: string;
    resetToken: string | null;
    tokenCreationDate: string | null;
    codeActeur: string;
    nomActeur: string;
    username: string | null;
    adresseActeur: string;
    telephoneActeur: string;
    whatsAppActeur: string;
    latitude: string | null;
    longitude: string | null;
    photoSiegeActeur: string | null;
    logoActeur: string | null;
    niveau3PaysActeur: string;
    password?: string;
    dateAjout: string;
    dateModif: string | null;
    personneModif: string | null;
    localiteActeur: string;
    emailActeur: string;
    statutActeur: boolean;
    isConnected: boolean | null;
    hasAssociation: boolean;
    pays: string | null;
    speculation: Speculation[];
    typeActeur: TypeActeur[];
}