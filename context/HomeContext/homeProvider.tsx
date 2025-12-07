import { Magasin } from "@/Types/Magasin"
import { homeContextType } from "@/Types/homeType"
import { CreateMagasinData } from "@/Types/merchantType"
import { createMagasin } from "@/service/magasin/create"
import { getAllMagasinsByActeur } from "@/service/magasin/getAllByActeur"
import { ReactNode, useState } from "react"
import { HomeContext } from "./homeContext"

export default ({ children }: { children: ReactNode }) => {
    // États pour les données
    const [magasins, setMagasins] = useState<Magasin[]>([])

    // États de chargement
    const [loadingMagasins, setLoadingMagasins] = useState(false)

    // États d'erreur
    const [errorMagasins, setErrorMagasins] = useState<string | null>(null)

    // Fonction pour réinitialiser toutes les erreurs
    const clearErrors = () => {
        setErrorMagasins(null)

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

        // États de chargement
        loadingMagasins,

        // États d'erreur
        errorMagasins,

        // Fonction pour réinitialiser toutes les erreurs
        fetchMagasins,

    }

    return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>
}