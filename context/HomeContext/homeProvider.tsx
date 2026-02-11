import { TYPE_ACTEUR_T } from "@/Types";
import { Filiere } from "@/Types/Filiere";
import { Magasin } from "@/Types/Magasin";
import { Stock } from "@/Types/Stock";
import { homeContextType } from "@/Types/homeType";
import { getAllFilliere } from "@/service/filliere/getAll";
import getAllMagasin from "@/service/magasin/getAll";
import { getAllStocks } from "@/service/productByUser/getAll";
import getAllStocksByFiliere from "@/service/stocks/getAll";
import { getAllTypeActeur } from "@/service/typeActeur";
import { ReactNode, useState } from "react";
import { HomeContext } from "./homeContext";

export default ({ children }: { children: ReactNode }) => {
  // États pour les données
  const [magasins, setMagasins] = useState<Magasin[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [typeActeur, setTypeActeur] = useState<TYPE_ACTEUR_T[]>([]);
  const [fillieres, setFillieres] = useState<Filiere[]>([]);
  const [stocksByFiliere, setStocksByFiliere] = useState<Stock[]>([]);

  // États de chargement
  const [loadingMagasins, setLoadingMagasins] = useState(false);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [loadingTypeActeur, setLoadingTypeActeur] = useState(false);
  const [loadingFillieres, setLoadingFillieres] = useState(false);
  const [loadingStocksByFiliere, setLoadingStocksByFiliere] = useState(false);

  // États d'erreur
  const [errorMagasins, setErrorMagasins] = useState<string | null>(null);
  const [errorStocks, setErrorStocks] = useState<string | null>(null);
  const [errorTypeActeur, setErrorTypeActeur] = useState<string | null>(null);
  const [errorFillieres, setErrorFillieres] = useState<string | null>(null);
  const [errorStocksByFiliere, setErrorStocksByFiliere] = useState<
    string | null
  >(null);

  // Fonction pour réinitialiser toutes les erreurs
  const clearErrors = () => {
    setErrorMagasins(null);
    setErrorStocks(null);
    setErrorTypeActeur(null);
  };

  // getAllFilliere
  const getAllFillieres = async () => {
    try {
      setLoadingFillieres(true);
      setErrorFillieres(null);
      const data = await getAllFilliere();
      setFillieres(data);
    } catch (error: any) {
      setErrorFillieres(error.message);
    } finally {
      setLoadingFillieres(false);
    }
  };

  // getAllStocksByFiliere
  const getAllByfillierer = async (libelleFiliere: string) => {
    try {
      setLoadingStocksByFiliere(true);
      setErrorStocksByFiliere(null);
      const data = await getAllStocksByFiliere(libelleFiliere);
      setStocksByFiliere(data);
    } catch (error: any) {
      setErrorStocksByFiliere(error.message);
    } finally {
      setLoadingStocksByFiliere(false);
    }
  };

  // getAllTypeActeur
  const getAllTypeActeurs = async () => {
    try {
      setLoadingTypeActeur(true);
      setErrorTypeActeur(null);
      const data = await getAllTypeActeur();
      console.log("mackytype", data);
      setTypeActeur(data);
    } catch (error: any) {
      setErrorTypeActeur(error.message);
    } finally {
      setLoadingTypeActeur(false);
    }
  };

  //getAllStok
  const getAllStock = async () => {
    try {
      setLoadingStocks(true);
      setErrorStocks(null);
      const data = await getAllStocks();
      setStocks(data);
    } catch (error: any) {
      setErrorStocks(error.message);
    } finally {
      setLoadingStocks(false);
    }
  };

  // getAllMagasin
  const getAllMagasins = async () => {
    try {
      setLoadingMagasins(true);
      setErrorMagasins(null);
      const data = await getAllMagasin();
      setMagasins(data);
    } catch (error: any) {
      setErrorMagasins(error.message);
    } finally {
      setLoadingMagasins(false);
    }
  };
  const value: homeContextType = {
    // États pour les données
    magasins,
    stocks,
    typeActeur,
    fillieres,
    stocksByFiliere,

    // États de chargement
    loadingMagasins,
    loadingStocks,
    loadingTypeActeur,
    loadingFillieres,
    loadingStocksByFiliere,

    // États d'erreur
    errorMagasins,
    errorStocks,
    errorTypeActeur,
    errorFillieres,
    errorStocksByFiliere,

    // Fonction pour réinitialiser toutes les erreurs
    getAllMagasins,
    getAllStock,
    getAllTypeActeurs,
    getAllFillieres,
    getAllByfillierer,

    clearErrors,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
