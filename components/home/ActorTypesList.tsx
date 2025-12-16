import { TYPE_ACTEUR_T } from "@/Types";
import {
  Briefcase,
  Building2,
  ChevronRight,
  Factory,
  Handshake,
  Package,
  Shield,
  Sprout,
  Store,
  Truck,
  User,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ActorTypesListProps {
  actorTypes: TYPE_ACTEUR_T[];
  onActorTypePress: (type: TYPE_ACTEUR_T) => void;
}

const isActeurAdmin = (codeTypeActeur: string) => {
  return codeTypeActeur === "U633";
};

// Mapping des icônes par codeTypeActeur pour une correspondance stable
const ACTOR_ICONS: Record<string, React.ComponentType<any>> = {
  A294: Truck, // Transporteur
  J527: Factory, // Transformateur
  K198: Sprout, // Producteur
  T629: Briefcase, // Prestataire
  K180: Handshake, // Partenaires de développement
  V454: Package, // Fournisseur
  X373: Store, // Commercant
  U633: Shield, // Admin
  D083: Building2, // Acteur public
};

// Fonction pour obtenir l'icône appropriée
const getActorIcon = (codeTypeActeur: string) => {
  return ACTOR_ICONS[codeTypeActeur] || User; // User par défaut pour les nouveaux acteurs
};

export default function ActorTypesList({
  actorTypes,
  onActorTypePress,
}: ActorTypesListProps) {
  return (
    <View className="bg-amber-50 rounded-2xl p-4 -mx-4 mb-4 mt-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-gray-800">Types d'acteurs</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-yellow-500 text-sm font-semibold mr-1">
            Tout voir
          </Text>
          <ChevronRight size={16} color="#eab308" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-4">
          {actorTypes
            .filter((type) => !isActeurAdmin(type.codeTypeActeur))
            .map((type) => {
              const IconComponent = getActorIcon(type.codeTypeActeur);
              return (
                <TouchableOpacity
                  key={type.idTypeActeur}
                  onPress={() => onActorTypePress(type)}
                  className="items-center min-w-[72px]"
                >
                  <View className="w-14 h-14 bg-yellow-500 rounded-2xl items-center justify-center shadow-sm">
                    <IconComponent size={24} color="black" />
                  </View>
                  <Text className="text-gray-800 text-[11px] text-center mt-2 font-medium">
                    {type.libelle}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}
