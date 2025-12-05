export interface Filiere {
    idFiliere: string;
    codeFiliere: string;
    libelleFiliere: string;
    descriptionFiliere: string;
    statutFiliere: boolean;
    dateAjout: string;
    dateModif: string | null;
    personneModif: string | null;
    hasAssociation: boolean;
}