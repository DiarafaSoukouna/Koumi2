export interface TypeActeur {
    idTypeActeur: string
    libelle: string
    codeTypeActeur: string
    statutTypeActeur: boolean
    descriptionTypeActeur: string
    personneModif: string | null
    dateAjout: string
    dateModif: string | null
    hasAssociation: boolean
}