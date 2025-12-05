import { Continent } from "./Continent";

export interface SousRegion {
    idSousRegion: string;
    codeSousRegion: string;
    nomSousRegion: string;
    statutSousRegion: boolean;
    dateAjout: string;
    dateModif: string | null;
    personneModif: string | null;
    hasAssociation: boolean;
    continent: Continent;
}