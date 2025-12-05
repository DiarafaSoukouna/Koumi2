export interface Monnaie {
    idMonnaie: string
    codeMonnaie: string
    libelle: string
    sigle: string
    dateAjout: string
    dateModif: string | null
    statut: boolean
    hasAssociation: boolean
}