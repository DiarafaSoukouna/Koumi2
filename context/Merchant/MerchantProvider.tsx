// contexts/merchantContext.tsx
import {
    CreateMagasinData,
    CreateStockData,
    CreateZoneProductionData,
    Magasin,
    MerchantContextType,
    Speculation,
    ZoneProduction
} from "@/Types/merchantType"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { MerchantContext } from "./merchantContext"

import { createMagasin } from "@/service/magasin/create"
import { deleteMagasin } from "@/service/magasin/delete"
import { getAllMagasinsByActeur } from "@/service/magasin/getAllByActeur"
import { updateMagasin } from "@/service/magasin/update"
import { getAllMonnaie } from "@/service/monnaie/getAllMonnaie"
import { getAllNiveau1Pays } from "@/service/niveau1Pays/getAll"
import { getAllPays } from "@/service/pays/getAll"
import { createStock } from "@/service/productByUser/create"
import { deleteStock } from "@/service/productByUser/delete"
import { getAllStocksByActeur } from "@/service/productByUser/getAllByActeur"
import { updateStock } from "@/service/productByUser/update"
import { getAllSpeculationsByActeur } from "@/service/speculation/getAllByActeur"
import { getAllVehicule } from "@/service/Transporteur/getAll"
import { getAllUnite } from "@/service/unite/getAll"
import { createZoneProduction } from "@/service/zoneProduction/create"
import { deleteZoneProduction } from "@/service/zoneProduction/delete"
import { getAllZonesByActeur } from "@/service/zoneProduction/getAllByActeur"
import { updateZoneProduction } from "@/service/zoneProduction/update"
import { Niveau1Pays } from "@/Types/magasinTypes"
import { Monnaie } from "@/Types/monnaie"
import { Pays } from "@/Types/pays"
import { Stock } from "@/Types/Stock"
import { Vehicule } from "@/Types/transportType"
import { Unite } from "@/Types/Unite"
// import { useAuth } from "./authContext"

interface Notification {
    type: 'success' | 'error' | 'info';
    message: string;
    id: string;
}

export default ({ children }: { children: ReactNode }) => {
    //   const { user } = useAuth();

    // ID dynamique basé sur l'utilisateur connecté
    const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1';

    // États pour les données
    const [zonesProduction, setZonesProduction] = useState<ZoneProduction[]>([])
    const [magasins, setMagasins] = useState<Magasin[]>([])
    const [stocks, setStocks] = useState<Stock[]>([])
    const [monnaies, setMonnaies] = useState<Monnaie[]>([])
    const [speculations, setSpeculations] = useState<Speculation[]>([])
    const [pays, setPays] = useState<Pays[]>([])
    const [niveau1Pays, setNiveau1Pays] = useState<Niveau1Pays[]>([])
    const [vehicules, setVehicules] = useState<Vehicule[]>([])
    const [unites, setUnites] = useState<Unite[]>([])

    // États de chargement
    const [loadingZones, setLoadingZones] = useState(false)
    const [loadingMagasins, setLoadingMagasins] = useState(false)
    const [loadingStocks, setLoadingStocks] = useState(false)
    const [loadingMonnaies, setLoadingMonnaies] = useState(false)
    const [loadingSpeculations, setLoadingSpeculations] = useState(false)
    const [loadingPays, setLoadingPays] = useState(false)
    const [loadingNiveau1Pays, setLoadingNiveau1Pays] = useState(false)
    const [loadingVehicules, setLoadingVehicules] = useState(false)
    const [loadingUnites, setLoadingUnites] = useState(false)

    // États d'erreur
    const [errorZones, setErrorZones] = useState<string | null>(null)
    const [errorMagasins, setErrorMagasins] = useState<string | null>(null)
    const [errorStocks, setErrorStocks] = useState<string | null>(null)
    const [errorMonnaies, setErrorMonnaies] = useState<string | null>(null)
    const [errorSpeculations, setErrorSpeculations] = useState<string | null>(null)
    const [errorPays, setErrorPays] = useState<string | null>(null)
    const [errorNiveau1Pays, setErrorNiveau1Pays] = useState<string | null>(null)
    const [errorVehicules, setErrorVehicules] = useState<string | null>(null)
    const [errorUnites, setErrorUnites] = useState<string | null>(null)

    // Notifications
    const [notifications, setNotifications] = useState<Notification[]>([])

    // Fonction pour ajouter une notification
    const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
        const id = Date.now().toString();
        const newNotification: Notification = { type, message, id };

        setNotifications(prev => [...prev, newNotification]);

        // Supprimer automatiquement après 5 secondes
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    // Fonction pour supprimer une notification
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Fonction pour réinitialiser toutes les erreurs
    const clearErrors = useCallback(() => {
        setErrorZones(null)
        setErrorMagasins(null)
        setErrorStocks(null)
        setErrorMonnaies(null)
        setErrorSpeculations(null)
        setErrorPays(null)
        setErrorNiveau1Pays(null)
        setErrorVehicules(null)
        setErrorUnites(null)
    }, [])

    // Fonction pour charger toutes les données
    const refreshAll = useCallback(async () => {
        clearErrors();

        try {
            await Promise.all([
                fetchZonesProduction(),
                fetchMagasins(),
                fetchStocks(),
                fetchMonnaies(),
                fetchSpeculations(),
                fetchPays(),
                fetchNiveau1Pays(),
                fetchVehicules(),
                fetchUnites(),
            ]);

            showNotification('success', 'Données rafraîchies avec succès');
        } catch (error: any) {
            showNotification('error', 'Erreur lors du rafraîchissement des données');
            console.error('Error refreshing all data:', error);
        }
    }, [clearErrors, showNotification])

    // Zones de Production
    const fetchZonesProduction = useCallback(async () => {
        try {
            setLoadingZones(true)
            setErrorZones(null)
            const data = await getAllZonesByActeur()
            setZonesProduction(data)
        } catch (error: any) {
            setErrorZones(error.message)
            showNotification('error', `Erreur zones: ${error.message}`)
        } finally {
            setLoadingZones(false)
        }
    }, [showNotification])

    const createZone = useCallback(async (data: CreateZoneProductionData) => {
        try {
            setErrorZones(null)
            const zoneData = {
                ...data,
                acteur: { idActeur: ACTEUR_ID }
            }
            await createZoneProduction(zoneData)
            await fetchZonesProduction()
            showNotification('success', 'Zone créée avec succès')
        } catch (error: any) {
            setErrorZones(error.message)
            showNotification('error', `Erreur création zone: ${error.message}`)
            throw error
        }
    }, [ACTEUR_ID, fetchZonesProduction, showNotification])

    const updateZone = useCallback(async (id: string, data: Partial<CreateZoneProductionData>) => {
        try {
            setErrorZones(null)
            await updateZoneProduction(id, data)
            await fetchZonesProduction()
            showNotification('success', 'Zone mise à jour avec succès')
        } catch (error: any) {
            setErrorZones(error.message)
            showNotification('error', `Erreur mise à jour zone: ${error.message}`)
            throw error
        }
    }, [fetchZonesProduction, showNotification])

    const deleteZone = useCallback(async (id: string) => {
        try {
            setErrorZones(null)
            await deleteZoneProduction(id)
            await fetchZonesProduction()
            showNotification('success', 'Zone supprimée avec succès')
        } catch (error: any) {
            setErrorZones(error.message)
            showNotification('error', `Erreur suppression zone: ${error.message}`)
            throw error
        }
    }, [fetchZonesProduction, showNotification])

    // Magasins
    const fetchMagasins = useCallback(async () => {
        try {
            setLoadingMagasins(true)
            setErrorMagasins(null)
            const data = await getAllMagasinsByActeur()
            setMagasins(data)
        } catch (error: any) {
            setErrorMagasins(error.message)
            showNotification('error', `Erreur magasins: ${error.message}`)
        } finally {
            setLoadingMagasins(false)
        }
    }, [showNotification])

    const createMagasinHandler = useCallback(async (data: CreateMagasinData) => {
        try {
            setErrorMagasins(null)
            const magasinData = {
                ...data,
                acteur: { idActeur: ACTEUR_ID },
                niveau1Pays: { idNiveau1Pays: data.niveau1PaysId || "6v2lj7juf22zlt2e0k1n" }
            }
            await createMagasin(magasinData)
            await fetchMagasins()
            showNotification('success', 'Magasin créé avec succès')
        } catch (error: any) {
            setErrorMagasins(error.message)
            showNotification('error', `Erreur création magasin: ${error.message}`)
            throw error
        }
    }, [ACTEUR_ID, fetchMagasins, showNotification])

    const updateMagasinHandler = useCallback(async (id: string, data: Partial<CreateMagasinData>) => {
        try {
            setErrorMagasins(null)
            await updateMagasin(id, data)
            await fetchMagasins()
            showNotification('success', 'Magasin mis à jour avec succès')
        } catch (error: any) {
            setErrorMagasins(error.message)
            showNotification('error', `Erreur mise à jour magasin: ${error.message}`)
            throw error
        }
    }, [fetchMagasins, showNotification])

    const deleteMagasinHandler = useCallback(async (id: string) => {
        try {
            setErrorMagasins(null)
            await deleteMagasin(id)
            await fetchMagasins()
            showNotification('success', 'Magasin supprimé avec succès')
        } catch (error: any) {
            setErrorMagasins(error.message)
            showNotification('error', `Erreur suppression magasin: ${error.message}`)
            throw error
        }
    }, [fetchMagasins, showNotification])

    // Stocks
    const fetchStocks = useCallback(async () => {
        try {
            setLoadingStocks(true)
            setErrorStocks(null)
            const data = await getAllStocksByActeur()
            setStocks(data)
        } catch (error: any) {
            setErrorStocks(error.message)
            showNotification('error', `Erreur stocks: ${error.message}`)
        } finally {
            setLoadingStocks(false)
        }
    }, [showNotification])

    const createStockHandler = useCallback(async (data: CreateStockData) => {
        try {
            setErrorStocks(null)
            const stockData = {
                ...data,
                acteur: { idActeur: ACTEUR_ID }
            }
            await createStock(stockData)
            await fetchStocks()
            showNotification('success', 'Produit créé avec succès')
        } catch (error: any) {
            setErrorStocks(error.message)
            showNotification('error', `Erreur création produit: ${error.message}`)
            throw error
        }
    }, [ACTEUR_ID, fetchStocks, showNotification])

    const updateStockHandler = useCallback(async (id: string, data: Partial<CreateStockData>) => {
        try {
            setErrorStocks(null)
            await updateStock(id, data)
            await fetchStocks()
            showNotification('success', 'Produit mis à jour avec succès')
        } catch (error: any) {
            setErrorStocks(error.message)
            showNotification('error', `Erreur mise à jour produit: ${error.message}`)
            throw error
        }
    }, [fetchStocks, showNotification])

    const deleteStockHandler = useCallback(async (id: string) => {
        try {
            setErrorStocks(null)
            await deleteStock(id)
            await fetchStocks()
            showNotification('success', 'Produit supprimé avec succès')
        } catch (error: any) {
            setErrorStocks(error.message)
            showNotification('error', `Erreur suppression produit: ${error.message}`)
            throw error
        }
    }, [fetchStocks, showNotification])

    // Unites
    const fetchUnites = useCallback(async () => {
        try {
            setLoadingUnites(true)
            setErrorUnites(null)
            const data = await getAllUnite()
            setUnites(data)
        } catch (error: any) {
            setErrorUnites(error.message)
            showNotification('error', `Erreur unités: ${error.message}`)
        } finally {
            setLoadingUnites(false)
        }
    }, [showNotification])

    // Monnaies
    const fetchMonnaies = useCallback(async () => {
        try {
            setLoadingMonnaies(true)
            setErrorMonnaies(null)
            const data = await getAllMonnaie()
            setMonnaies(data)
        } catch (error: any) {
            setErrorMonnaies(error.message)
            showNotification('error', `Erreur monnaies: ${error.message}`)
        } finally {
            setLoadingMonnaies(false)
        }
    }, [showNotification])

    // Spéculations
    const fetchSpeculations = useCallback(async () => {
        try {
            setLoadingSpeculations(true)
            setErrorSpeculations(null)
            const data = await getAllSpeculationsByActeur()
            setSpeculations(data)
        } catch (error: any) {
            setErrorSpeculations(error.message)
            showNotification('error', `Erreur spéculations: ${error.message}`)
        } finally {
            setLoadingSpeculations(false)
        }
    }, [showNotification])

    // Pays
    const fetchPays = useCallback(async () => {
        try {
            setLoadingPays(true)
            setErrorPays(null)
            const data = await getAllPays()
            setPays(data)
        } catch (error: any) {
            setErrorPays(error.message)
            showNotification('error', `Erreur pays: ${error.message}`)
        } finally {
            setLoadingPays(false)
        }
    }, [showNotification])

    // Niveau 1 Pays
    const fetchNiveau1Pays = useCallback(async () => {
        try {
            setLoadingNiveau1Pays(true)
            setErrorNiveau1Pays(null)
            const data = await getAllNiveau1Pays()
            setNiveau1Pays(data)
        } catch (error: any) {
            setErrorNiveau1Pays(error.message)
            showNotification('error', `Erreur régions: ${error.message}`)
        } finally {
            setLoadingNiveau1Pays(false)
        }
    }, [showNotification])

    // Vehicules
    const fetchVehicules = useCallback(async () => {
        try {
            setLoadingVehicules(true)
            setErrorVehicules(null)
            const data = await getAllVehicule()
            setVehicules(data)
        } catch (error: any) {
            setErrorVehicules(error.message)
            showNotification('error', `Erreur véhicules: ${error.message}`)
        } finally {
            setLoadingVehicules(false)
        }
    }, [showNotification])

    // Charger les données initiales
    useEffect(() => {
        refreshAll();
    }, [refreshAll])

    const value: MerchantContextType = {
        // États des données
        zonesProduction,
        magasins,
        stocks,
        monnaies,
        speculations,
        pays,
        niveau1Pays,
        vehicules,
        unites,

        // États de chargement
        loadingZones,
        loadingMagasins,
        loadingStocks,
        loadingMonnaies,
        loadingSpeculations,
        loadingPays,
        loadingNiveau1Pays,
        loadingVehicules,
        loadingUnites,

        // États d'erreur
        errorZones,
        errorMagasins,
        errorStocks,
        errorMonnaies,
        errorSpeculations,
        errorPays,
        errorNiveau1Pays,
        errorVehicules,
        errorUnites,

        // Notifications
        notifications,
        showNotification,
        removeNotification,

        // Fonctions
        fetchZonesProduction,
        fetchMagasins,
        fetchStocks,
        fetchMonnaies,
        fetchSpeculations,
        fetchPays,
        fetchNiveau1Pays,
        fetchVehicules,
        fetchUnites,
        refreshAll,

        createZoneProduction: createZone,
        createMagasin: createMagasinHandler,
        createStock: createStockHandler,

        updateZoneProduction: updateZone,
        updateMagasin: updateMagasinHandler,
        updateStock: updateStockHandler,

        deleteZoneProduction: deleteZone,
        deleteMagasin: deleteMagasinHandler,
        deleteStock: deleteStockHandler,

        clearErrors,
    }

    return <MerchantContext.Provider value={value}>{children}</MerchantContext.Provider>
}