// créer un fichier: @/constants/filiereIcons.ts
import {
    Apple,
    Beef,
    Coffee,
    Droplets,
    Factory,
    Leaf,
    Milk,
    Package,
    Pill,
    Sprout,
    TestTube,
    Tractor,
    Trees,
    Wheat
} from 'lucide-react-native';

export const getFiliereIcon = (libelleFiliere: string) => {
  const libelle = libelleFiliere.toLowerCase();
  
  if (libelle.includes('végétale') || libelle.includes('legume') || libelle.includes('fruit')) {
    return { icon: Leaf, color: '#10B981' }; // vert
  }
  if (libelle.includes('équipement') || libelle.includes('materiel') || libelle.includes('outillage')) {
    return { icon: Tractor, color: '#3B82F6' }; // bleu
  }
  if (libelle.includes('semence') || libelle.includes('plant')) {
    return { icon: Sprout, color: '#22C55E' }; // vert clair
  }
  if (libelle.includes('phytosanitaire') || libelle.includes('pesticide')) {
    return { icon: TestTube, color: '#EF4444' }; // rouge
  }
  if (libelle.includes('engrais') || libelle.includes('fertilisant')) {
    return { icon: Droplets, color: '#8B5CF6' }; // violet
  }
  if (libelle.includes('animal') || libelle.includes('bovin') || libelle.includes('volaille')) {
    return { icon: Beef, color: '#F59E0B' }; // orange
  }
  if (libelle.includes('complement') || libelle.includes('nutrition')) {
    return { icon: Pill, color: '#EC4899' }; // rose
  }
  if (libelle.includes('transformé') || libelle.includes('produit fini')) {
    return { icon: Factory, color: '#6366F1' }; // indigo
  }
  if (libelle.includes('céréale') || libelle.includes('blé') || libelle.includes('maïs')) {
    return { icon: Wheat, color: '#D97706' }; // ambre
  }
  if (libelle.includes('lait') || libelle.includes('laitier')) {
    return { icon: Milk, color: '#60A5FA' }; // bleu clair
  }
  if (libelle.includes('café') || libelle.includes('cacao')) {
    return { icon: Coffee, color: '#92400E' }; // marron
  }
  if (libelle.includes('arbre') || libelle.includes('forêt')) {
    return { icon: Trees, color: '#059669' }; // émeraude
  }
  
  // Icônes par défaut selon certaines correspondances
  if (libelle.includes('produit')) {
    return { icon: Package, color: '#6B7280' }; // gris
  }
  
  return { icon: Apple, color: '#8B5CF6' }; // violet par défaut
};

// Couleurs prédéfinies pour varier le design
export const filiereColors = [
  '#079C48', // bleu
  '#079C48', // vert
  '#079C48', // orange
  '#079C48', // rouge
  '#079C48', // violet
  '#079C48', // rose
  '#079C48', // indigo
  '#079C48', // ambre
  '#079C48', // émeraude
  '#079C48', // rouge foncé
  '#079C48', // violet foncé
  '#079C48', // bleu ciel
];