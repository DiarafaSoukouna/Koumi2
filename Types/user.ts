export interface User {
  idActeur: string;
  nomActeur: string;
  username: string;
  emailActeur: string;
  telephoneActeur: string;
  adresseActeur: string;
  localiteActeur: string;
  niveau3PaysActeur: string;
  codeActeur: string;
  logoActeur?: string;
  photoSiegeActeur?: string;
  statutActeur: boolean;
  dateAjout: string;
  dateModif?: string;
  typeActeur: Array<{
    idTypeActeur: string;
    libelle: string;
    codeTypeActeur: string;
    descriptionTypeActeur: string;
    statutTypeActeur: boolean;
  }>;
  speculation: Array<{
    idSpeculation: string;
    nomSpeculation: string;
    codeSpeculation: string;
    descriptionSpeculation: string;
    statutSpeculation: boolean;
  }>;
  hasAssociation: boolean;
  whatsAppActeur?: string;
  pays?: string;
  latitude?: number;
  longitude?: number;
  isConnected?: boolean;
  personneModif?: string;
  resetToken?: string;
  tokenCreationDate?: string;
}