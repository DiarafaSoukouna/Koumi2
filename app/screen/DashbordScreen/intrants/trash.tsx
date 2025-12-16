import { useIntrant } from "@/context/Intrant";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  Scale,
  Share2,
  ShoppingCart,
  Tag,
  Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IntrantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { intrantList, loading, deleteIntrant, fetchIntrant } = useIntrant();

  const [intrant, setIntrant] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);

  useEffect(() => {
    loadIntrant();
  }, [id]);

  useEffect(() => {
    if (intrantList.length > 0 && id) {
      const foundIntrant = intrantList.find((item) => item.idIntrant === id);
      if (foundIntrant) {
        setIntrant(foundIntrant);
      }
    }
  }, [intrantList, id]);

  const loadIntrant = async () => {
    try {
      setLoadingDetail(true);
      // Recharger la liste au cas où
      await fetchIntrant();
    } catch (error) {
      console.error("Erreur chargement détail:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = () => {
    if (!intrant) return;

    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer "${intrant.nomIntrant}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteIntrant(intrant.idIntrant);
              router.back();
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer l'intrant");
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!intrant) return;

    try {
      const message =
        `Découvrez cet intrant agricole: ${intrant.nomIntrant}\n\n` +
        `💵 Prix: ${intrant.prixIntrant} ${intrant.monnaie?.symbole || ""}\n` +
        `📦 Quantité: ${intrant.quantiteIntrant} ${intrant.unite}\n` +
        `📝 Description: ${intrant.descriptionIntrant?.substring(0, 100)}...`;

      await Share.share({
        message,
        title: intrant.nomIntrant,
      });
    } catch (error) {
      console.error("Erreur partage:", error);
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copié", "Le texte a été copié dans le presse-papier");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non défini";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: number, monnaie?: any) => {
    const formatted = new Intl.NumberFormat("fr-FR").format(price);
    return monnaie ? `${formatted} ${monnaie.symbole || ""}` : `${formatted}`;
  };

  const getExpirationStatus = () => {
    if (!intrant?.dateExpiration) return null;

    const expiration = new Date(intrant.dateExpiration);
    const today = new Date();
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return {
        label: "Expiré",
        color: "bg-red-100",
        textColor: "text-red-600",
        icon: AlertTriangle,
      };

    if (diffDays <= 7)
      return {
        label: "Expire bientôt",
        color: "bg-orange-100",
        textColor: "text-orange-600",
        icon: AlertTriangle,
      };

    if (diffDays <= 30)
      return {
        label: "Expire ce mois",
        color: "bg-yellow-100",
        textColor: "text-yellow-600",
        icon: Calendar,
      };

    return null;
  };

  if (loadingDetail || (!intrant && loading)) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!intrant) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-4">
          <Package size={64} color="#D1D5DB" />
          <Text className="text-gray-800 text-lg font-medium mt-4">
            Intrant non trouvé
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            L'intrant que vous cherchez n'existe pas ou a été supprimé.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Retour à la liste</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const expirationStatus = getExpirationStatus();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec image */}
        <View className="relative">
          {intrant.photoIntrant ? (
            <Image
              source={{ uri: intrant.photoIntrant }}
              className="w-full h-64"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-64 bg-gray-200 items-center justify-center">
              <Package size={64} color="#9CA3AF" />
            </View>
          )}

          {/* Overlay et boutons d'action */}
          <View className="absolute top-0 left-0 right-0 px-4 pt-3">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
              >
                <ArrowLeft size={24} color="white" />
              </TouchableOpacity>

              <View className="flex-row">
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      `/screen/DashbordScreen/intrants/edit/[id]${intrant.idIntrant}`
                    )
                  }
                  className="w-10 h-10 bg-black/50 rounded-full items-center justify-center mr-2"
                >
                  <Edit size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShare}
                  className="w-10 h-10 bg-black/50 rounded-full items-center justify-center mr-2"
                >
                  <Share2 size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
                  className="w-10 h-10 bg-red-500 rounded-full items-center justify-center"
                >
                  <Trash2 size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Badge statut */}
          {expirationStatus && (
            <View
              className={`absolute bottom-4 right-4 px-3 py-1 rounded-full ${expirationStatus.color}`}
            >
              <View className="flex-row items-center">
                <expirationStatus.icon
                  size={14}
                  className={expirationStatus.textColor}
                />
                <Text
                  className={`ml-1 font-medium ${expirationStatus.textColor}`}
                >
                  {expirationStatus.label}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Contenu principal */}
        <View className="px-4 pt-6">
          {/* Titre et prix */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-gray-800">
                {intrant.nomIntrant}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Code: {intrant.codeIntrant}
              </Text>
            </View>

            <View className="bg-primary/10 px-4 py-3 rounded-lg">
              <Text className="text-2xl font-bold text-primary">
                {formatPrice(intrant.prixIntrant, intrant.monnaie)}
              </Text>
              <Text className="text-gray-600 text-xs text-center">
                Prix unitaire
              </Text>
            </View>
          </View>

          {/* Description */}
          {intrant.descriptionIntrant ? (
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">
                Description
              </Text>
              <Text className="text-gray-600 leading-relaxed">
                {intrant.descriptionIntrant}
              </Text>
            </View>
          ) : null}

          {/* Stats */}
          <View className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
            <Text className="text-gray-700 font-medium mb-4">Informations</Text>

            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-8">
                  <Scale size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-600 flex-1">
                  Quantité disponible
                </Text>
                <Text className="font-medium text-gray-800">
                  {intrant.quantiteIntrant} {intrant.unite}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8">
                  <Tag size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-600 flex-1">Catégorie</Text>
                <Text className="font-medium text-gray-800">
                  {intrant.categorieProduit?.libelleCategorie}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8">
                  <Package size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-600 flex-1">Forme</Text>
                <Text className="font-medium text-gray-800">
                  {intrant.forme?.libelleForme}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8">
                  <DollarSign size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-600 flex-1">Monnaie</Text>
                <Text className="font-medium text-gray-800">
                  {intrant.monnaie?.libelle} ({intrant.monnaie?.symbole})
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8">
                  <Calendar size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-600 flex-1">Date d'expiration</Text>
                <Text className="font-medium text-gray-800">
                  {formatDate(intrant.dateExpiration)}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8">
                  <Globe size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-600 flex-1">Pays d'origine</Text>
                <Text className="font-medium text-gray-800">
                  {intrant.pays || "Non spécifié"}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8">
                  <Eye size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-600 flex-1">Nombre de vues</Text>
                <Text className="font-medium text-gray-800">
                  {intrant.nbreView || 0}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8">
                  <ShoppingCart size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-600 flex-1">Statut</Text>
                <View
                  className={`px-2 py-1 rounded-full ${
                    intrant.statutIntrant ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      intrant.statutIntrant ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {intrant.statutIntrant ? "Disponible" : "Indisponible"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Information sur le vendeur/acteur */}
          {intrant.acteur && (
            <View className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
              <Text className="text-gray-700 font-medium mb-4">
                Informations du vendeur
              </Text>

              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-gray-800 font-bold">
                    {intrant.acteur.nomActeur?.charAt(0) || "A"}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    {intrant.acteur.nomActeur || "Non spécifié"}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {intrant.acteur.typeActeur?.libelle || ""}
                  </Text>
                </View>
              </View>

              {intrant.acteur.localisationActeur && (
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(intrant.acteur.localisationActeur)
                  }
                  className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-2"
                >
                  <MapPin size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 flex-1">
                    {intrant.acteur.localisationActeur}
                  </Text>
                  <Text className="text-primary text-sm">Copier</Text>
                </TouchableOpacity>
              )}

              {intrant.acteur.telephoneActeur && (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${intrant.acteur.telephoneActeur}`)
                  }
                  className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-2"
                >
                  <Phone size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 flex-1">
                    {intrant.acteur.telephoneActeur}
                  </Text>
                  <Text className="text-primary text-sm">Appeler</Text>
                </TouchableOpacity>
              )}

              {intrant.acteur.emailActeur && (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`mailto:${intrant.acteur.emailActeur}`)
                  }
                  className="flex-row items-center p-3 bg-gray-50 rounded-lg"
                >
                  <Mail size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 flex-1">
                    {intrant.acteur.emailActeur}
                  </Text>
                  <Text className="text-primary text-sm">Contacter</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Métadonnées */}
          <View className="mb-6">
            <Text className="text-gray-500 text-sm">
              Ajouté le {formatDate(intrant.dateAjout)}
            </Text>
            {intrant.dateModif && (
              <Text className="text-gray-500 text-sm">
                Dernière modification le {formatDate(intrant.dateModif)}
              </Text>
            )}
          </View>

          {/* Boutons d'action */}
          <View className="flex-row space-x-3 mb-8">
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `/screen/DashbordScreen/intrants/edit/[id]${intrant.idIntrant}`
                )
              }
              className="flex-1 bg-yellow-500 py-4 rounded-lg items-center"
            >
              <Text className="text-white font-medium">Modifier l'intrant</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="flex-1 bg-gray-200 py-4 rounded-lg items-center"
            >
              <Text className="text-gray-800 font-medium">Partager</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
