import { CategorieProduit } from "@/Types/CategorieProduits";
import { Forme } from "@/Types/forme";
import {
  CreateIntrantData,
  Intrant,
  IntrantContextTypes,
  UpdateIntrantData,
} from "@/Types/intrant";
import { Monnaie } from "@/Types/monnaie";
import getAllCategories from "@/service/categories/getAll";
import { getAllForme } from "@/service/forme/getAll";
import { createIntrant as createIntrantService } from "@/service/intrant/create";
import { deleteIntrant as deleteIntrantService } from "@/service/intrant/delete";
import { getAllIntrant } from "@/service/intrant/getAll";
import { getAllIntrantByActeur } from "@/service/intrant/getAllByActeur";
import { updateIntrant as updateIntrantService } from "@/service/intrant/update";
import { getAllMonnaie } from "@/service/monnaie/getAllMonnaie";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth";
import { IntrantContext } from "./intrantContext";

export default ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [GetAllIntranByActeur, setGetAllIntranByActeur] = useState<Intrant[]>(
    []
  );
  const [GetAllintrantList, setGetAllintrantList] = useState<Intrant[]>([]);
  const [loadingMonnaies, setLoadingMonnaies] = useState(false);
  const [errorMonnaies, setErrorMonnaies] = useState<string | null>(null);
  const [monnaies, setMonnaies] = useState<Monnaie[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategorieProduit[]>([]);
  const [loadingFormes, setLoadingFormes] = useState(false);
  const [errorFormes, setErrorFormes] = useState<string | null>(null);
  const [formes, setFormes] = useState<Forme[]>([]);
  const [loadingByActeur, setLoadingByActeur] = useState(false);
  const [errorByActeur, setErrorByActeur] = useState<string | null>(null);
  const { user } = useAuth();

  const getActeurId = useCallback(() => {
    if (!user) {
      throw new Error("Utilisateur non connecté");
    }
    if (!user.idActeur) {
      throw new Error("ID utilisateur non disponible");
    }
    return user.idActeur;
  }, [user]);

  const getAllByActeur = useCallback(async () => {
    if (!user) {
      setErrorByActeur("Utilisateur non connecté");
      return;
    }
    try {
      setLoadingByActeur(true);
      setErrorByActeur(null);
      const acteurId = getActeurId();
      console.log("ID de l'acteur:", acteurId);
      const data = await getAllIntrantByActeur(acteurId);
      setGetAllIntranByActeur(data);
    } catch (error: any) {
      setErrorByActeur(error.message);
    } finally {
      setLoadingByActeur(false);
    }
  }, [user, getActeurId]);

  const fetchIntrant = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllIntrant();
      setGetAllintrantList(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createIntrant = useCallback(
    async (data: CreateIntrantData) => {
      try {
        setError(null);
        const acteurId = getActeurId();
        const intrantData = {
          ...data,
          acteur: { idActeur: acteurId },
        };
        await createIntrantService(intrantData);
        await getAllByActeur(); // Recharger la liste par acteur
        await fetchIntrant(); // Recharger la liste globale
      } catch (error: any) {
        setError(error.message);
        throw error;
      }
    },
    [getAllByActeur, fetchIntrant, getActeurId]
  );

  const updateIntrant = useCallback(
    async (id: string, data: UpdateIntrantData) => {
      try {
        setError(null);
        const acteurId = getActeurId();
        const intrantData = {
          ...data,
          acteur: { idActeur: acteurId },
        };
        await updateIntrantService(id, intrantData);
        await getAllByActeur(); // Recharger la liste par acteur
        await fetchIntrant(); // Recharger la liste globale
      } catch (error: any) {
        setError(error.message);
        throw error; // Propager l'erreur pour la gérer dans le composant
      }
    },
    [getAllByActeur, fetchIntrant, getActeurId]
  );

  const deleteIntrant = useCallback(
    async (id: string) => {
      try {
        setError(null);
        getActeurId();
        await deleteIntrantService(id);
        await getAllByActeur(); // Recharger la liste par acteur
        await fetchIntrant();
      } catch (error: any) {
        setError(error.message);
        throw error;
      }
    },
    [getAllByActeur, fetchIntrant, getActeurId]
  );

  // Monnaies
  const fetchMonnaies = async () => {
    try {
      setLoadingMonnaies(true);
      setErrorMonnaies(null);
      const data = await getAllMonnaie();
      setMonnaies(data);
    } catch (error: any) {
      setErrorMonnaies(error.message);
    } finally {
      setLoadingMonnaies(false);
    }
  };

  // categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setErrorCategories(null);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error: any) {
      setErrorCategories(error.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  // formes
  const fetchFormes = async () => {
    try {
      setLoadingFormes(true);
      setErrorFormes(null);
      const data = await getAllForme();
      setFormes(data);
    } catch (error: any) {
      setErrorFormes(error.message);
    } finally {
      setLoadingFormes(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllByActeur();
      fetchIntrant();
      fetchCategories();
      fetchFormes();
      fetchMonnaies();
    }
  }, [user, getAllByActeur]);

  const value: IntrantContextTypes = {
    GetAllIntranByActeur,
    GetAllintrantList,
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
    errorFormes,
  };

  return (
    <IntrantContext.Provider value={value}>{children}</IntrantContext.Provider>
  );
};
