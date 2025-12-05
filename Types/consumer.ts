export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Filiere {
  idFiliere: string
  codeFiliere: string
  libelleFiliere: string
  descriptionFiliere: string
  statutFiliere: boolean
  dateAjout: string
  dateModif: string | null
  personneModif: string | null
  hasAssociation: boolean
}

export interface Intrant {
  idIntrant: string
  nomIntrant: string
  quantiteIntrant: number
  codeIntrant: string
  prixIntrant: number
  descriptionIntrant: string
  photoIntrant: string
  statutIntrant: boolean
  dateExpiration: string
  dateAjout: string
  dateModif: string | null
  personneModif: string | null
  pays: string
  hasAssociation: boolean
  unite: string
  nbreView: number

  categorieProduit: {
    idCategorieProduit: string
    codeCategorie: string
    libelleCategorie: string
    descriptionCategorie: string
    statutCategorie: boolean
    personneModif: string | null
    dateAjout: string
    dateModif: string | null
    hasAssociation: boolean

    filiere: {
      idFiliere: string
      codeFiliere: string
      libelleFiliere: string
      descriptionFiliere: string
      statutFiliere: boolean
      dateAjout: string
      dateModif: string | null
      personneModif: string | null
      hasAssociation: boolean
    }
  }

  acteur: {
    idActeur: string
    nomActeur: string
    telephoneActeur: string
    whatsAppActeur: string
    adresseActeur: string
    localiteActeur: string
  }

  forme:{
    idForme: string
    codeForme: string
    libelleForme: string
    descriptionForme: string
    statutForme: boolean
    dateAjout: string | null
    hasAssociation: boolean
  }
}

export interface ProductLite {
  id: string
  name: string
  price: number
  image: string
  description: string
  stock: number
  seller: string
}

export const toProductLite = (intrant: Intrant): ProductLite => ({
  id: intrant.idIntrant,
  name: intrant.nomIntrant,
  price: intrant.prixIntrant,
  image: `https://api.koumi.ml/api-koumi/intrant/photo/${intrant.photoIntrant}`,
  description: intrant.descriptionIntrant,
  stock: intrant.quantiteIntrant,
  seller: intrant.acteur.nomActeur
})

export interface ConsumerContextType {
  categories: Category[]
  fetchCategories: () => Promise<void>
  loadingCategories: boolean
  errorCategories: string | null

  products: Intrant[]
  selectedProduct: Intrant | null
  setSelectedProduct: (product: Intrant | null) => void
}
