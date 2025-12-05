import { Acteur } from "./Acteur"
import { TypeActeur } from "./ActeurTypes"
import { CategorieProduit } from "./CategorieProduits"
import { Speculation } from "./merchantType"


export interface ZoneProduction {
    idZoneProduction: string
    codeZone: string
    nomZoneProduction: string
    latitude: string
    longitude: string
    photoZone: string
    dateAjout: string
    dateModif: string | null
    hasAssociation: boolean
    personneModif: string | null
    statutZone: boolean
}

export interface ZoneProductionDetail {
    idZoneProduction: string
    codeZone: string
    nomZoneProduction: string
    latitude: string
    longitude: string
    photoZone: string
    dateAjout: string
    dateModif: string | null
    hasAssociation: boolean
    personneModif: string | null
    statutZone: boolean
    acteur: Acteur
}