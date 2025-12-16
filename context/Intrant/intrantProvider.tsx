import { ReactNode, useState } from "react"
import { CreateIntrantData, IntrantContextTypes, UpdateIntrantData } from "@/Types/intrant"
import { IntrantContext } from "./intrantContext"
import { Intrant } from "@/Types/intrant"
import { getAllIntrant } from "@/service/intrant/getAll"
import { createIntrant as createIntrantService } from "@/service/intrant/create"
import { updateIntrant as updateIntrantService } from "@/service/intrant/update"
import { deleteIntrant as deleteIntrantService } from "@/service/intrant/delete"
import { Monnaie } from "@/Types/monnaie"
import { getAllMonnaie } from "@/service/monnaie/getAllMonnaie"
import getAllCategories from "@/service/categories/getAll"
import { CategorieProduit } from "@/Types/CategorieProduits"
import { getAllForme } from "@/service/forme/getAll"
import { Forme } from "@/Types/forme"
import { getAllIntrantByActeur } from "@/service/intrant/getAllByActeur"

const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1'

export default ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [intrantList, setIntrantList] = useState<Intrant[]>([])
    const [loadingMonnaies, setLoadingMonnaies] = useState(false)
    const [errorMonnaies, setErrorMonnaies] = useState<string | null>(null)
    const [monnaies, setMonnaies] = useState<Monnaie[]>([])
    const [loadingCategories, setLoadingCategories] = useState(false)
    const [errorCategories, setErrorCategories] = useState<string | null>(null)
    const [categories, setCategories] = useState<CategorieProduit[]>([])
    const [loadingFormes, setLoadingFormes] = useState(false)
    const [errorFormes, setErrorFormes] = useState<string | null>(null)
    const [formes, setFormes] = useState<Forme[]>([])
    const [loadingByActeur, setLoadingByActeur] = useState(false)
    const [errorByActeur, setErrorByActeur] = useState<string | null>(null)

    const getAllByActeur = async () => {
        try {
            setLoadingByActeur(true)
            setErrorByActeur(null)
            const data = await getAllIntrantByActeur()
            setIntrantList(data)
        } catch (error: any) {
            setErrorByActeur(error.message)
        } finally {
            setLoadingByActeur(false)
        }
    }

    const fetchIntrant = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getAllIntrant()
            setIntrantList(data)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const createIntrant = async (data: CreateIntrantData) => {
        try {
            setError(null)
            const intrantData = {
                ...data,
                acteur: { idActeur: ACTEUR_ID }
            }
            await createIntrantService(intrantData)
            await fetchIntrant() // Recharger la liste
        } catch (error: any) {
            setError(error.message)
            throw error
        }
    }

    const updateIntrant = async (id: string, data: UpdateIntrantData) => {
        try {
            setError(null)
            const intrantData = {
                ...data,
                acteur: { idActeur: ACTEUR_ID }
            }
            await updateIntrantService(id, intrantData)
            await fetchIntrant() // Recharger la liste
        } catch (error: any) {
            setError(error.message)
            throw error // Propager l'erreur pour la gérer dans le composant
        }
    }

    const deleteIntrant = async (id: string) => {
        try {
            setError(null)
            await deleteIntrantService(id)
            await fetchIntrant()
        } catch (error: any) {
            setError(error.message)
            throw error
        }
    }

    // Monnaies
    const fetchMonnaies = async () => {
        try {
            setLoadingMonnaies(true)
            setErrorMonnaies(null)
            const data = await getAllMonnaie()
            setMonnaies(data)
        } catch (error: any) {
            setErrorMonnaies(error.message)
        } finally {
            setLoadingMonnaies(false)
        }
    }

    // categories
    const fetchCategories = async () => {
        try {
            setLoadingCategories(true)
            setErrorCategories(null)
            const data = await getAllCategories()
            setCategories(data)
        } catch (error: any) {
            setErrorCategories(error.message)
        } finally {
            setLoadingCategories(false)
        }
    }

    // formes
    const fetchFormes = async () => {
        try {
            setLoadingFormes(true)
            setErrorFormes(null)
            const data = await getAllForme()
            setFormes(data)
        } catch (error: any) {
            setErrorFormes(error.message)
        } finally {
            setLoadingFormes(false)
        }
    }

    const value: IntrantContextTypes = {
        intrantList,
        loading,
        error,
        fetchIntrant,
        createIntrant,
        updateIntrant,
        deleteIntrant,
        getAllByActeur,
        loadingByActeur,
        errorByActeur,

        fetchMonnaies,
        monnaies,
        loadingMonnaies,
        errorMonnaies,
        // categories
        fetchCategories,
        categories,
        loadingCategories,
        errorCategories,

        // formes
        fetchFormes,
        formes,
        loadingFormes,
        errorFormes
    }

    return <IntrantContext.Provider value={value}>{children}</IntrantContext.Provider>
}