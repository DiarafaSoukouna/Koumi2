// service/auth/createUser.ts
import axiosInstance from "@/constants/axiosInstance"
import { registerType } from "@/Types/authtype"

export const createUser = async (data: registerType): Promise<any> => {
    try {
        const formData = new FormData()
        
        // Préparer les spéculations et types d'acteur sous forme d'objets
        const speculationArray = data.speculation.map(id => ({
            idSpeculation: id
        }))
        
        const typeActeurArray = data.typeActeur.map(id => ({
            idTypeActeur: id
        }))
        
        // Créer l'objet acteur avec le bon format
        const acteurData = {
            nomActeur: data.nomActeur,
            username: data.username,
            adresseActeur: data.adresseActeur,
            telephoneActeur: data.telephoneActeur,
            niveau3PaysActeur: data.niveau3PaysActeur,
            password: data.password,
            localiteActeur: data.localiteActeur,
            speculation: speculationArray,
            typeActeur: typeActeurArray
        }
        
        formData.append("acteur", JSON.stringify(acteurData))
        
        console.log('Données envoyées:', acteurData)
        
        const response = await axiosInstance.post("/acteur/create", formData)
        console.log('response acteur', response.data)
        return response.data
    } catch (error) {
        console.error('error creation', error)
        throw error
    }
}