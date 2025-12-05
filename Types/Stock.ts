import { Acteur } from "./Acteur";
import { Magasin } from "./Magasin";
import { Monnaie } from "./monnaie";
import { Speculation } from "./Speculation";
import { Unite } from "./Unite";
import { ZoneProductionDetail } from "./zoneProductionTypes";


export interface Stock {
    idStock: string;
    codeStock: string;
    nomProduit: string;
    quantiteStock: number;
    prix: number;
    typeProduit: string;
    origineProduit: string;
    descriptionStock: string;
    photo: string;
    zoneProduction: ZoneProductionDetail;
    dateAjout: string;
    formeProduit: string;
    dateModif: string | null;
    personneModif: string | null;
    pays: string;
    statutSotck: boolean; // Note: Il y a une faute dans l'API (Sotck au lieu de Stock)
    nbreView: number;
    speculation: Speculation;
    unite: Unite;
    magasin: Magasin;
    acteur: Acteur;
    monnaie: Monnaie;
}

// Type pour un tableau de stocks
export type StockList = Stock[];