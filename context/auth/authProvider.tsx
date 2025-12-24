// app/providers/authContext.tsx
import { createUser } from "@/service/auth/createUser";
import { loginUser } from "@/service/auth/loginUser";
import { loginUserCodePin } from "@/service/auth/loginUserCodePin";
import { getAllNiveau3Pays } from "@/service/niveau3Pays/getAll";
import { getAllSpeculations } from "@/service/speculation/getAll";
import { getAllTypeActeur } from "@/service/typeActeur";
import { TYPE_ACTEUR_T } from "@/Types";
import { AuthContextType, loginType, registerType } from "@/Types/authtype";
import { Niveau3Pays } from "@/Types/Niveau3Pays";
import { Speculation } from "@/Types/Speculation";
import { User } from "@/Types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

export default ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speculations, setSpeculations] = useState<Speculation[]>([]);
  const [loadingSpeculations, setLoadingSpeculations] = useState(false);
  const [errorSpeculations, setErrorSpeculations] = useState<string | null>(
    null
  );
  const [niveau3Pays, setNiveau3Pays] = useState<Niveau3Pays[]>([]);
  const [loadingNiveau3Pays, setLoadingNiveau3Pays] = useState(false);
  const [errorNiveau3Pays, setErrorNiveau3Pays] = useState<string | null>(null);
  const [typeActeur, setTypeActeur] = useState<TYPE_ACTEUR_T[]>([]);
  const [loadingTypeActeur, setLoadingTypeActeur] = useState(false);
  const [errorTypeActeur, setErrorTypeActeur] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fonction pour charger l'utilisateur depuis AsyncStorage au démarrage
  const loadUserFromStorage = async () => {
    try {
      setIsInitializing(true);
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const login = async (data: loginType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(data);

      await AsyncStorage.setItem("userToken", response.token || "");
      const userData = response.user || response;
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      console.log("Connexion réussie", userData);
      setUser(userData);
      router.replace("/(tabs)");
    } catch (error: any) {
      setError(error.response?.data?.message || "Erreur de connexion");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginCodePin = async (data: loginType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUserCodePin(data);

      await AsyncStorage.setItem("userToken", response.token || "");
      const userData = response.user || response;
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      console.log("Connexion réussie avec code pin", userData);
      setUser(userData);
      router.replace("/(tabs)");
    } catch (error: any) {
      setError(error.response?.data?.message || "Erreur de connexion");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: registerType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createUser(data);

      if (response.token) {
        await AsyncStorage.setItem("userToken", response.token);
        const userData = response.user || response;
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
        router.replace("/(tabs)");
      } else {
        router.replace("/screen/(auth)/login");
      }

      return response;
    } catch (error: any) {
      setError(error.response?.data?.message || "Erreur d'inscription");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      setUser(null);
      router.replace("/screen/(auth)/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les informations utilisateur depuis AsyncStorage
  const getUserInfo = async (): Promise<User | null> => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des infos utilisateur:",
        error
      );
      return null;
    }
  };

  // Mettre à jour les informations utilisateur
  const updateUserInfo = async (updatedUser: Partial<User>) => {
    try {
      if (user) {
        const newUser = { ...user, ...updatedUser };
        await AsyncStorage.setItem("userData", JSON.stringify(newUser));
        setUser(newUser);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Reste du code reste identique...
  const getAllSpeculation = async () => {
    try {
      setLoadingSpeculations(true);
      setErrorSpeculations(null);
      const data = await getAllSpeculations();
      setSpeculations(data);
    } catch (error: any) {
      setErrorSpeculations(error.message);
      throw error;
    } finally {
      setLoadingSpeculations(false);
    }
  };

  const getAllNiveau = async () => {
    try {
      setLoadingNiveau3Pays(true);
      setErrorNiveau3Pays(null);
      const data = await getAllNiveau3Pays();
      setNiveau3Pays(data);
    } catch (error: any) {
      setErrorNiveau3Pays(error.message);
      throw error;
    } finally {
      setLoadingNiveau3Pays(false);
    }
  };

  const getAllTypeActeu = async () => {
    try {
      setLoadingTypeActeur(true);
      setErrorTypeActeur(null);
      const data = await getAllTypeActeur();
      setTypeActeur(data);
    } catch (error: any) {
      setErrorTypeActeur(error.message);
      throw error;
    } finally {
      setLoadingTypeActeur(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isInitializing,
    login,
    loginCodePin,
    register,
    logout,
    isLoading,
    error,
    clearError,
    getAllSpeculation,
    getAllNiveau,
    getAllTypeActeu,
    speculations,
    niveau3Pays,
    typeActeur,
    loadingSpeculations,
    loadingNiveau3Pays,
    loadingTypeActeur,
    errorSpeculations,
    errorNiveau3Pays,
    errorTypeActeur,
    getUserInfo,
    updateUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
