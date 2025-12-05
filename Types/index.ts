import { Dispatch, SetStateAction } from "react";

export type USE_STATE_T<T> = Dispatch<SetStateAction<T>>

export type LOADING_STATE_T = "En cours de chargement."
  | "Chargement finit."
  | "Chargement échoué."
  | "Chargememnt reussi"
  | "En attente"
  | null;

export interface TYPE_ACTEUR_T {
  idTypeActeur: string,
  libelle: string,
  codeTypeActeur: string,
  statutTypeActeur?: true,
  descriptionTypeActeur?: string,
  personneModif?: string,
  dateAjout?: string,
  dateModif?: string,
  hasAssociation: boolean
}