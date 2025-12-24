import { User } from "./user";

// Types/authtype.ts
export interface loginType {
    username: string;
    password: string;
    codeActeur: string;
}

export interface registerType {
    nomActeur: string;
    username: string;
    adresseActeur: string;
    telephoneActeur: string;
    niveau3PaysActeur: string;
    password: string;
    localiteActeur: string;
    speculation: string[];
    typeActeur: string[];
}

export interface registerFormType extends Omit<registerType, 'speculation' | 'typeActeur'> {
    confirmPassword: string;
    speculation: string[];
    typeActeur: string[];
}

export interface AuthContextType {
    user: User | null;
    isInitializing: boolean;
    login: (data: loginType) => Promise<void>;
    loginCodePin: (data: loginType) => Promise<void>;
    register: (data: registerType) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    getAllSpeculation: () => Promise<void>;
    getAllNiveau: () => Promise<void>;
    getAllTypeActeu: () => Promise<void>;
    speculations: any[];
    niveau3Pays: any[];
    typeActeur: any[];
    loadingSpeculations: boolean;
    loadingNiveau3Pays: boolean;
    loadingTypeActeur: boolean;
    errorSpeculations: string | null;
    errorNiveau3Pays: string | null;
    errorTypeActeur: string | null;
    getUserInfo: () => Promise<User | null>;
    updateUserInfo: (updatedUser: Partial<User>) => Promise<void>;
}