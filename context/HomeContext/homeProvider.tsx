import { TYPE_ACTEUR_T } from "@/Types"
import { Magasin } from "@/Types/Magasin"
import { Stock } from "@/Types/Stock"
import { homeContextType } from "@/Types/homeType"
import getAllMagasin from "@/service/magasin/getAll"
import { getAllStocks } from "@/service/productByUser/getAll"
import { getAllTypeActeur } from "@/service/typeActeur"
import { ReactNode, useState } from "react"
import { HomeContext } from "./homeContext"
const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1'

export default ({ children }: { children: ReactNode }) => {
    // États pour les données
    const [magasins, setMagasins] = useState<Magasin[]>([])
    const [stocks, setStocks] = useState<Stock[]>([])
    const [typeActeur, setTypeActeur] = useState<TYPE_ACTEUR_T[]>([])

    // États de chargement
    const [loadingMagasins, setLoadingMagasins] = useState(false)
    const [loadingStocks, setLoadingStocks] = useState(false)
    const [loadingTypeActeur, setLoadingTypeActeur] = useState(false)

    // États d'erreur
    const [errorMagasins, setErrorMagasins] = useState<string | null>(null)
    const [errorStocks, setErrorStocks] = useState<string | null>(null)
    const [errorTypeActeur, setErrorTypeActeur] = useState<string | null>(null)

    // Fonction pour réinitialiser toutes les erreurs
    const clearErrors = () => {
        setErrorMagasins(null)
        setErrorStocks(null)
        setErrorTypeActeur(null)


    }

    // getAllTypeActeur
    const getAllTypeActeurs = async () => {
        try {
            setLoadingTypeActeur(true)
            setErrorTypeActeur(null)
            const data = await getAllTypeActeur()
            setTypeActeur(data)
        } catch (error: any) {
            setErrorTypeActeur(error.message)
        } finally {
            setLoadingTypeActeur(false)
        }
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
    const value: homeContextType = {

        // États pour les données
        magasins,
        stocks,
        typeActeur,

        // États de chargement
        loadingMagasins,
        loadingStocks,
        loadingTypeActeur,

        // États d'erreur
        errorMagasins,
        errorStocks,
        errorTypeActeur,

        // Fonction pour réinitialiser toutes les erreurs
        getAllMagasins,
        getAllStock,
        getAllTypeActeurs,


        clearErrors,

    }

    return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>
}