import { Magasin } from "@/Types/Magasin"
import { Stock } from "@/Types/Stock"
import { homeContextType } from "@/Types/homeType"
import { CreateMagasinData } from "@/Types/merchantType"
import { createMagasin } from "@/service/magasin/create"
import { deleteMagasin } from "@/service/magasin/delete"
import getAllMagasin from "@/service/magasin/getAll"
import { getAllMagasinsByActeur } from "@/service/magasin/getAllByActeur"
import { updateMagasin } from "@/service/magasin/update"
import { getAllStocks } from "@/service/productByUser/getAll"
import { ReactNode, useState } from "react"
import { HomeContext } from "./homeContext"
const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1'

export default ({ children }: { children: ReactNode }) => {
    // États pour les données
    const [magasins, setMagasins] = useState<Magasin[]>([])
    const [stocks, setStocks] = useState<Stock[]>([])

    // États de chargement
    const [loadingMagasins, setLoadingMagasins] = useState(false)
    const [loadingStocks, setLoadingStocks] = useState(false)

    // États d'erreur
    const [errorMagasins, setErrorMagasins] = useState<string | null>(null)
    const [errorStocks, setErrorStocks] = useState<string | null>(null)

    // Fonction pour réinitialiser toutes les erreurs
    const clearErrors = () => {
        setErrorMagasins(null)
        setErrorStocks(null)

    }

    //getAllStok
    const getAllStock = async () => {
        try {
            setLoadingStocks(true)
            setErrorStocks(null)
            const data = await getAllStocks()
            setStocks(data)
        } catch (error: any) {
            setErrorStocks(error.message)
        } finally {
            setLoadingStocks(false)
        }
    }

    // getAllMagasin
    const getAllMagasins = async () => {
        try {
            setLoadingMagasins(true)
            setErrorMagasins(null)
            const data = await getAllMagasin()
            setMagasins(data)
        } catch (error: any) {
            setErrorMagasins(error.message)
        } finally {
            setLoadingMagasins(false)
        }
    }
    // Magasins
    const fetchMagasins = async () => {
        try {
            setLoadingMagasins(true)
            setErrorMagasins(null)
            const data = await getAllMagasinsByActeur()
            // console.log("magazinByacteur", data)
            setMagasins(data)
        } catch (error: any) {
            setErrorMagasins(error.message)
        } finally {
            setLoadingMagasins(false)
        }
    }

    const createMagasinHandler = async (data: CreateMagasinData) => {
        try {
            setErrorMagasins(null)
            const magasinData = {
                ...data,
                acteur: { idActeur: ACTEUR_ID },
                niveau1Pays: { idNiveau1Pays: "6v2lj7juf22zlt2e0k1n" } // ID statique pour le moment
            }
            await createMagasin(magasinData)
            await fetchMagasins()
        } catch (error: any) {
            setErrorMagasins(error.message)
            throw error
        }
    }

    const updateMagasinHandler = async (id: string, data: Partial<CreateMagasinData>) => {
        try {
            setErrorMagasins(null)
            await updateMagasin(id, data)
            await fetchMagasins()
        } catch (error: any) {
            setErrorMagasins(error.message)
            throw error
        }
    }

    const deleteMagasinHandler = async (id: string) => {
        try {
            setErrorMagasins(null)
            await deleteMagasin(id)
            await fetchMagasins()
        } catch (error: any) {
            setErrorMagasins(error.message)
            throw error
        }
    }

    const value: homeContextType = {

        // États pour les données
        magasins,
        stocks,

        // États de chargement
        loadingMagasins,
        loadingStocks,

        // États d'erreur
        errorMagasins,
        errorStocks,

        // Fonction pour réinitialiser toutes les erreurs
        fetchMagasins,
        getAllMagasins,
        createMagasinHandler,
        updateMagasinHandler,
        deleteMagasinHandler,
        getAllStock,

    }

    return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>
}