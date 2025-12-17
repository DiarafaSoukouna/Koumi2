// contexts/transporteurContext.tsx
import { TypeVoiture } from "@/Types/TypeVoiture";
import { Monnaie } from "@/Types/monnaie";
import { Pays } from "@/Types/pays";
import {
  CreateVehiculeData,
  TransporteurContextType,
  Vehicule,
} from "@/Types/transportType";
import { createVehicule as createVehiculeAPI } from "@/service/Transporteur/create";
import { deleteTransporteur as deleteVehiculeAPI } from "@/service/Transporteur/delete";
import { getAllVehiculeByActeur } from "@/service/Transporteur/getAllByActeur";
import { updatedTransporteur as updateVehiculeAPI } from "@/service/Transporteur/update";
import { getAllTypeVoiture } from "@/service/TypeVoiture/getAll";
import { getAllMonnaie } from "@/service/monnaie/getAllMonnaie";
import { getAllPays } from "@/service/pays/getAll";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { TransporteurContext } from "./transporteurContext";
// import { useAuth } from "./authContext"

interface Notification {
  type: "success" | "error" | "info";
  message: string;
  id: string;
}

export default ({ children }: { children: ReactNode }) => {
  // const { user } = useAuth();

  // ID dynamique basé sur l'utilisateur
  const ACTEUR_ID = "d48lrq5lpgw53adl0yq1";

  // États pour les données
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [typeVoitures, setTypeVoitures] = useState<TypeVoiture[]>([]);
  const [monnaies, setMonnaies] = useState<Monnaie[]>([]);
  const [pays, setPays] = useState<Pays[]>([]);

  // États de chargement
  const [loadingVehicules, setLoadingVehicules] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingMonnaies, setLoadingMonnaies] = useState(false);
  const [loadingPays, setLoadingPays] = useState(false);

  // États d'erreur
  const [errorVehicules, setErrorVehicules] = useState<string | null>(null);
  const [errorTypes, setErrorTypes] = useState<string | null>(null);
  const [errorMonnaies, setErrorMonnaies] = useState<string | null>(null);
  const [errorPays, setErrorPays] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fonction pour ajouter une notification
  const showNotification = useCallback(
    (type: "success" | "error" | "info", message: string) => {
      const id = Date.now().toString();
      const newNotification: Notification = { type, message, id };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    []
  );

  // Fonction pour supprimer une notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Fonction pour réinitialiser les erreurs
  const clearErrors = useCallback(() => {
    setErrorVehicules(null);
    setErrorTypes(null);
    setErrorMonnaies(null);
    setErrorPays(null);
  }, []);

  // Récupérer tous les véhicules
  const fetchVehicules = useCallback(async () => {
    try {
      setLoadingVehicules(true);
      setErrorVehicules(null);
      const data = await getAllVehiculeByActeur();
      setVehicules(data);
    } catch (error: any) {
      setErrorVehicules(error.message);
      showNotification("error", `Erreur véhicules: ${error.message}`);
    } finally {
      setLoadingVehicules(false);
    }
  }, [showNotification]);

  // Récupérer tous les types de voiture
  const fetchTypeVoitures = useCallback(async () => {
    try {
      setLoadingTypes(true);
      setErrorTypes(null);
      const data = await getAllTypeVoiture();
      setTypeVoitures(data);
    } catch (error: any) {
      setErrorTypes(error.message);
      showNotification("error", `Erreur types véhicules: ${error.message}`);
    } finally {
      setLoadingTypes(false);
    }
  }, [showNotification]);

  // Récupérer toutes les monnaies
  const fetchMonnaies = useCallback(async () => {
    try {
      setLoadingMonnaies(true);
      setErrorMonnaies(null);
      const data = await getAllMonnaie();
      setMonnaies(data);
    } catch (error: any) {
      setErrorMonnaies(error.message);
      showNotification("error", `Erreur monnaies: ${error.message}`);
    } finally {
      setLoadingMonnaies(false);
    }
  }, [showNotification]);

  // Récupérer tous les pays
  const fetchPays = useCallback(async () => {
    try {
      setLoadingPays(true);
      setErrorPays(null);
      const data = await getAllPays();
      setPays(data);
    } catch (error: any) {
      setErrorPays(error.message);
      showNotification("error", `Erreur pays: ${error.message}`);
    } finally {
      setLoadingPays(false);
    }
  }, [showNotification]);

  // Fonction pour charger toutes les données
  const refreshAll = useCallback(async () => {
    clearErrors();

    try {
      await Promise.all([
        fetchVehicules(),
        fetchTypeVoitures(),
        fetchMonnaies(),
        fetchPays(),
      ]);

      showNotification("success", "Données transporteur rafraîchies");
    } catch (error: any) {
      showNotification("error", "Erreur lors du rafraîchissement");
      console.error("Error refreshing transporteur data:", error);
    }
  }, [
    clearErrors,
    fetchVehicules,
    fetchTypeVoitures,
    fetchMonnaies,
    fetchPays,
    showNotification,
  ]);

  // Créer un véhicule
  const createVehicule = useCallback(
    async (data: CreateVehiculeData) => {
      try {
        setLoadingVehicules(true);
        setErrorVehicules(null);
        const vehiculeData = {
          ...data,
          acteur: { idActeur: ACTEUR_ID },
        };
        await createVehiculeAPI(vehiculeData);
        await fetchVehicules();
        showNotification("success", "Véhicule créé avec succès");
      } catch (error: any) {
        setErrorVehicules(error.message);
        showNotification("error", `Erreur création véhicule: ${error.message}`);
        throw error;
      } finally {
        setLoadingVehicules(false);
      }
    },
    [ACTEUR_ID, fetchVehicules, showNotification]
  );

  // Mettre à jour un véhicule
  const updateVehicule = useCallback(
    async (id: string, data: Partial<CreateVehiculeData>) => {
      try {
        setLoadingVehicules(true);
        setErrorVehicules(null);
        await updateVehiculeAPI(id, data);
        await fetchVehicules();
        showNotification("success", "Véhicule mis à jour avec succès");
      } catch (error: any) {
        setErrorVehicules(error.message);
        showNotification(
          "error",
          `Erreur mise à jour véhicule: ${error.message}`
        );
        throw error;
      } finally {
        setLoadingVehicules(false);
      }
    },
    [fetchVehicules, showNotification]
  );

  // Supprimer un véhicule
  const deleteVehicule = useCallback(
    async (id: string) => {
      try {
        setLoadingVehicules(true);
        setErrorVehicules(null);
        await deleteVehiculeAPI(id);
        await fetchVehicules();
        showNotification("success", "Véhicule supprimé avec succès");
      } catch (error: any) {
        setErrorVehicules(error.message);
        showNotification(
          "error",
          `Erreur suppression véhicule: ${error.message}`
        );
        throw error;
      } finally {
        setLoadingVehicules(false);
      }
    },
    [fetchVehicules, showNotification]
  );

  // Charger les données initiales
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const value: TransporteurContextType = {
    // États des données
    vehicules,
    typeVoitures,
    monnaies,
    pays,

    // États de chargement
    loadingVehicules,
    loadingTypes,
    loadingMonnaies,
    loadingPays,

    // États d'erreur
    errorVehicules,
    errorTypes,
    errorMonnaies,
    errorPays,

    // Notifications
    notifications,
    showNotification,
    removeNotification,

    // Fonctions
    fetchVehicules,
    fetchTypeVoitures,
    fetchMonnaies,
    fetchPays,
    refreshAll,
    createVehicule,
    updateVehicule,
    deleteVehicule,
    clearErrors,
  };

  return (
    <TransporteurContext.Provider value={value}>
      {children}
    </TransporteurContext.Provider>
  );
};
