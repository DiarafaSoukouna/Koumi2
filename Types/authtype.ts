// export interface loginType {
//     username: string;
//     password: string;
// }

// export interface registerType {
//     nomActeur: string;
//     username: string;
//     adresseActeur: string;
//     telephoneActeur: string;
//     niveau3PaysActeur: string;
//     password: string;
//     localiteActeur: string;
//     speculation: string[];
//     typeActeur: string[];
// }

// export interface AuthContextType {
//     user: any | null;
//     login: (data: loginType) => Promise<void>;
//     register: (data: registerType) => Promise<void>;
//     logout: () => void;
//     isLoading: boolean;
//     error: string | null;
//     clearError: () => void;
//     getAllSpeculation: () => Promise<void>;
//     getAllNiveau: () => Promise<void>;
//     getAllTypeActeu: () => Promise<void>;
//     speculations: any[];
//     niveau3Pays: any[];
//     typeActeur: any[];
//     loadingSpeculations: boolean;
//     loadingNiveau3Pays: boolean;
//     loadingTypeActeur: boolean;
//     errorSpeculations: string | null;
//     errorNiveau3Pays: string | null;
//     errorTypeActeur: string | null;
// }

// Types/authtype.ts
export interface loginType {
    username: string;
    password: string;
}

// Format pour l'API
export interface registerType {
    nomActeur: string;
    username: string;
    adresseActeur: string;
    telephoneActeur: string;
    niveau3PaysActeur: string;
    password: string;
    localiteActeur: string;
    speculation: string[]; // IDs des spéculations
    typeActeur: string[]; // IDs des types d'acteur
}

// Format pour le formulaire (avec confirmPassword)
export interface registerFormType extends Omit<registerType, 'speculation' | 'typeActeur'> {
    confirmPassword: string;
    speculation: string[];
    typeActeur: string[];
}

export interface AuthContextType {
    user: any | null;
    login: (data: loginType) => Promise<void>;
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
}