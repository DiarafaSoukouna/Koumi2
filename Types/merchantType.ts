import { Niveau1Pays } from "./magasinTypes"
import { Monnaie } from "./monnaie"
import { Pays } from "./pays"
import { Stock } from "./Stock"
import { Vehicule } from "./transportType"
import { Unite } from "./Unite"


export interface Speculation {
  idSpeculation: string
  codeSpeculation: string
  nomSpeculation: string
  descriptionSpeculation: string
  statutSpeculation: boolean
  hasAssociation: boolean
  dateAjout: string
  dateModif: string | null
  personneModif: string | null
}

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

export interface Magasin {
  idMagasin: string
  nomMagasin: string
  latitude: string | null
  longitude: string | null
  localiteMagasin: string
  contactMagasin: string
  pays: string
  nbreView: number
  dateAjout?: string
  dateModif?: string | null
  photo?: string
}


// Types pour les formulaires de création
export interface CreateZoneProductionData {
  codeZone: string
  nomZoneProduction: string
  latitude: string
  longitude: string
  personneModif: string | null
  acteur: { idActeur: string }
  image: string | undefined
}

export interface CreateMagasinData {
  nomMagasin: string
  latitude: string | null
  longitude: string | null
  localiteMagasin: string
  contactMagasin: string
  pays: string
  acteur: { idActeur: string }
  niveau1Pays: { idNiveau1Pays: string }
  photo: string
}

export interface CreateStockData {
  codeStock: string
  nomProduit: string
  quantiteStock: number
  prix: number
  typeProduit: string
  origineProduit: string
  descriptionStock: string
  photo: string,
  // zoneProduction: { idZoneProduction: string }
  zoneProduction?: { idZoneProduction: string }
  speculation: { idSpeculation: string }
  unite: { idUnite: string }
  magasin: { idMagasin: string }
  acteur: { idActeur: string }
  monnaie: { idMonnaie: string }
}

export interface MerchantContextType {
  // États pour les données
  zonesProduction: ZoneProduction[]
  magasins: Magasin[]
  stocks: Stock[]
  monnaies: Monnaie[]
  speculations: Speculation[]
  pays: Pays[]
  niveau1Pays: Niveau1Pays[]
  vehicules: Vehicule[]
  unites: Unite[]

  // États de chargement
  loadingZones: boolean
  loadingMagasins: boolean
  loadingStocks: boolean
  loadingMonnaies: boolean
  loadingSpeculations: boolean
  loadingPays: boolean
  loadingNiveau1Pays: boolean
  loadingVehicules: boolean
  loadingUnites: boolean

  // États d'erreur
  errorZones: string | null
  errorMagasins: string | null
  errorStocks: string | null
  errorMonnaies: string | null
  errorSpeculations: string | null
  errorPays: string | null
  errorNiveau1Pays: string | null
  errorVehicules: string | null
  errorUnites: string | null

  // Notifications
  notifications: Array<{ type: 'success' | 'error' | 'info'; message: string; id: string }>;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  removeNotification: (id: string) => void;

  // Fonctions de récupération
  fetchZonesProduction: () => Promise<void>
  fetchMagasins: () => Promise<void>
  fetchStocks: () => Promise<void>
  fetchMonnaies: () => Promise<void>
  fetchSpeculations: () => Promise<void>
  fetchPays: () => Promise<void>
  fetchNiveau1Pays: () => Promise<void>
  fetchVehicules: () => Promise<void>
  fetchUnites: () => Promise<void>
  refreshAll: () => Promise<void>

  // Fonctions de création
  createZoneProduction: (data: CreateZoneProductionData) => Promise<void>
  createMagasin: (data: CreateMagasinData) => Promise<void>
  createStock: (data: CreateStockData) => Promise<void>

  // Fonctions de mise à jour
  updateZoneProduction: (id: string, data: Partial<CreateZoneProductionData>) => Promise<void>
  updateMagasin: (id: string, data: Partial<CreateMagasinData>) => Promise<void>
  updateStock: (id: string, data: Partial<CreateStockData>) => Promise<void>

  // Fonctions de suppression
  deleteZoneProduction: (id: string) => Promise<void>
  deleteMagasin: (id: string) => Promise<void>
  deleteStock: (id: string) => Promise<void>

  // Réinitialisation des erreurs
  clearErrors: () => void
}