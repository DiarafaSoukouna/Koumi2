import { Intrant } from "@/Types/intrant";
import { useIntrant } from "@/context/Intrant";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Globe,
  Package,
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
  const { intrantList, loading, deleteIntrant, getAllByActeur } = useIntrant();

  const [intrant, setIntrant] = useState<Intrant | null>(null);
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
      if (getAllByActeur) {
        await getAllByActeur();
      }
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
        `💵 Prix: ${intrant.prixIntrant} ${intrant.monnaie?.sigle || ""}\n` +
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

  const formatPrice = (price: number, monnaie?: any): string => {
    // Formater le prix avec séparateurs de milliers
    const formattedPrice = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);

    // Si pas de monnaie, retourner juste le prix
    if (!monnaie) return formattedPrice;

    // Retourner selon le format souhaité
    return `${formattedPrice}`;
    // ou avec symbole: `${formattedPrice} ${monnaie.symbole || monnaie.sigle}`
  };
  const getExpirationStatus = () => {
    if (!intrant?.dateExpiration) return null;

    const expiration = new Date(intrant.dateExpiration);
    const today = new Date();
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: "EXPIRÉ",
        color: "bg-gradient-to-br from-red-50 to-rose-100",
        borderColor: "border-red-200",
        iconColor: "#DC2626",
        iconBgColor: "bg-red-100",
        textColor: "text-red-700",
        badgeColor: "bg-red-500",
        badgeTextColor: "text-white",
        hint: "Cette date est dépassée",
        hintColor: "text-red-500",
        icon: AlertTriangle,
      };
    }

    if (diffDays <= 7) {
      return {
        label: "URGENT",
        color: "bg-gradient-to-br from-orange-50 to-amber-100",
        borderColor: "border-orange-200",
        iconColor: "#EA580C",
        iconBgColor: "bg-orange-100",
        textColor: "text-orange-700",
        badgeColor: "bg-orange-500",
        badgeTextColor: "text-white",
        hint: `Expire dans ${diffDays} jour${diffDays > 1 ? "s" : ""}`,
        hintColor: "text-orange-500",
        icon: AlertTriangle,
      };
    }

    if (diffDays <= 30) {
      return {
        label: "PROCHE",
        color: "bg-gradient-to-br from-yellow-50 to-yellow-100",
        borderColor: "border-yellow-200",
        iconColor: "#CA8A04",
        iconBgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        badgeColor: "bg-yellow-500",
        badgeTextColor: "text-gray-800",
        hint: `Expire dans ${diffDays} jours`,
        hintColor: "text-yellow-600",
        icon: Calendar,
      };
    }

    return {
      label: "VALIDE",
      color: "bg-gradient-to-br from-green-50 to-emerald-100",
      borderColor: "border-green-200",
      iconColor: "#059669",
      iconBgColor: "bg-green-100",
      textColor: "text-green-700",
      badgeColor: "bg-green-500",
      badgeTextColor: "text-white",
      hint: `Valide encore ${diffDays} jours`,
      hintColor: "text-green-600",
      icon: CheckCircle,
    };
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
            className="mt-6 bg-black px-6 py-3 rounded-lg"
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
                      `/screen/DashbordScreen/intrants/edit/${intrant.idIntrant}`
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
          {/* Titre et prix - Design épuré */}
          <View className="mb-8">
            {/* En-tête avec fond dégradé */}
            <View className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-5 mb-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-4">
                  <Text className="text-2xl font-extrabold text-gray-900 mb-2">
                    {intrant.nomIntrant}
                  </Text>

                  {/* Informations rapides */}
                  <View className="flex-row items-center flex-wrap gap-3">
                    <View className="flex-row items-center bg-white px-3 py-1 rounded-full shadow-sm">
                      <Package size={14} color="#6B7280" />
                      <Text className="text-gray-700 text-sm ml-1">
                        {intrant.forme?.libelleForme}
                      </Text>
                    </View>

                    {intrant.categorieProduit && (
                      <View className="flex-row items-center bg-white px-3 py-1 rounded-full shadow-sm">
                        <Tag size={14} color="#6B7280" />
                        <Text className="text-gray-700 text-sm ml-1">
                          {intrant.categorieProduit.libelleCategorie}
                        </Text>
                      </View>
                    )}

                    <View
                      className={`px-3 py-1 rounded-full ${
                        intrant.statutIntrant
                          ? "bg-green-500/20"
                          : "bg-red-500/20"
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          intrant.statutIntrant
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {intrant.statutIntrant ? "✓ DISPO" : "✗ RUPTURE"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Prix en vedette */}
                <View className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 min-w-[100px]">
                  <Text className="text-primary text-2xl font-bold text-center">
                    {formatPrice(intrant.prixIntrant)}
                  </Text>
                  <Text className="text-gray-500 text-xs text-center mt-1">
                    {intrant.monnaie?.sigle || ""}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            {intrant.descriptionIntrant ? (
              <View className="bg-white rounded-xl p-5 border border-gray-200">
                <View className="flex-row items-center mb-4">
                  <FileText size={20} color="#4B5563" />
                  <Text className="text-lg font-bold text-gray-800 ml-2">
                    Description
                  </Text>
                </View>

                <View className="pl-1">
                  <Text className="text-gray-600 leading-relaxed text-base">
                    {intrant.descriptionIntrant}
                  </Text>

                  {/* Détails additionnels */}
                  <View className="flex-row flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                    {intrant.pays && (
                      <View className="flex-1 min-w-[120px]">
                        <Text className="text-gray-500 text-xs mb-1">
                          Origine
                        </Text>
                        <Text className="text-gray-800 font-medium">
                          {intrant.pays}
                        </Text>
                      </View>
                    )}

                    {intrant.dateExpiration && (
                      <View className="flex-1 min-w-[120px]">
                        <Text className="text-gray-500 text-xs mb-1">
                          Date d'expiration
                        </Text>
                        <Text className="text-gray-800 font-medium">
                          {formatDate(intrant.dateExpiration)}
                        </Text>
                      </View>
                    )}

                    <View className="flex-1 min-w-[120px]">
                      <Text className="text-gray-500 text-xs mb-1">Vues</Text>
                      <Text className="text-gray-800 font-medium">
                        {intrant.nbreView || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View className="bg-gray-50 rounded-xl p-5 border border-gray-200 border-dashed">
                <Text className="text-gray-500 text-center italic">
                  Aucune description n'a été ajoutée pour cet intrant
                </Text>
              </View>
            )}
          </View>

          {/* Stats */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              📋 Informations détaillées
            </Text>

            {/* Grille d'informations */}
            <View className="flex-row flex-wrap -mx-2">
              {/* Carte Quantité */}
              <View className="w-1/2 px-2 mb-4">
                <View className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <View className="flex-row items-center mb-2">
                    <View className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Scale size={20} color="#1D4ED8" />
                    </View>
                    <Text className="text-blue-700 font-medium">Quantité</Text>
                  </View>
                  <Text className="text-2xl font-bold text-gray-800">
                    {intrant.quantiteIntrant}
                    <Text className="text-lg text-gray-600 ml-1">
                      {intrant.unite}
                    </Text>
                  </Text>
                  <Text className="text-blue-600 text-xs mt-1">
                    Stock disponible
                  </Text>
                </View>
              </View>

              {/* Carte Prix */}
              <View className="w-1/2 px-2 mb-4">
                <View className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <View className="flex-row items-center mb-2">
                    <View className="bg-green-100 p-2 rounded-lg mr-3">
                      <DollarSign size={20} color="#059669" />
                    </View>
                    <Text className="text-green-700 font-medium">
                      Prix unitaire
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold text-gray-800">
                    {formatPrice(intrant.prixIntrant, intrant.monnaie)}
                  </Text>
                  <Text className="text-green-600 text-xs mt-1">
                    {intrant.monnaie?.libelle} ({intrant.monnaie?.sigle})
                  </Text>
                </View>
              </View>

              {/* Carte Catégorie */}
              <View className="w-1/2 px-2 mb-4">
                <View className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <View className="flex-row items-center mb-2">
                    <View className="bg-purple-100 p-2 rounded-lg mr-3">
                      <Tag size={20} color="#7C3AED" />
                    </View>
                    <Text className="text-purple-700 font-medium">
                      Catégorie
                    </Text>
                  </View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {intrant.categorieProduit?.libelleCategorie}
                  </Text>
                  <Text className="text-purple-600 text-xs mt-1">
                    Type de produit
                  </Text>
                </View>
              </View>

              {/* Carte Forme */}
              <View className="w-1/2 px-2 mb-4">
                <View className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                  <View className="flex-row items-center mb-2">
                    <View className="bg-amber-100 p-2 rounded-lg mr-3">
                      <Package size={20} color="#D97706" />
                    </View>
                    <Text className="text-amber-700 font-medium">Forme</Text>
                  </View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {intrant.forme?.libelleForme}
                  </Text>
                  <Text className="text-amber-600 text-xs mt-1">
                    Présentation
                  </Text>
                </View>
              </View>

              {/* Carte Date d'expiration */}
              <View
                className={`w-1/2 px-2 mb-4 ${
                  expirationStatus?.color || "bg-gray-50"
                }`}
              >
                <View
                  className={`rounded-xl p-4 border ${
                    expirationStatus?.borderColor || "border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <View
                        className={`p-2 rounded-lg mr-3 ${
                          expirationStatus?.iconBgColor || "bg-gray-100"
                        }`}
                      >
                        <Calendar
                          size={20}
                          color={expirationStatus?.iconColor || "#6B7280"}
                        />
                      </View>
                      <Text
                        className={
                          expirationStatus?.textColor || "text-gray-700"
                        }
                        style={{ fontWeight: "500" }}
                      >
                        Expiration
                      </Text>
                    </View>
                    {expirationStatus && (
                      <View
                        className={`px-2 py-1 rounded-full ${expirationStatus.badgeColor}`}
                      >
                        <Text
                          className={`text-xs font-bold ${expirationStatus.badgeTextColor}`}
                        >
                          {expirationStatus.label}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {formatDate(intrant.dateExpiration)}
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${
                      expirationStatus?.hintColor || "text-gray-500"
                    }`}
                  >
                    {expirationStatus?.hint || "Date de péremption"}
                  </Text>
                </View>
              </View>

              {/* Carte Pays */}
              <View className="w-1/2 px-2 mb-4">
                <View className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200">
                  <View className="flex-row items-center mb-2">
                    <View className="bg-cyan-100 p-2 rounded-lg mr-3">
                      <Globe size={20} color="#0E7490" />
                    </View>
                    <Text className="text-cyan-700 font-medium">Origine</Text>
                  </View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {intrant.pays || "Non spécifié"}
                  </Text>
                  <Text className="text-cyan-600 text-xs mt-1">
                    Pays d'origine
                  </Text>
                </View>
              </View>

              {/* Carte Statut */}
              <View className="w-full px-2 mb-4">
                <View
                  className={`rounded-xl p-4 border ${
                    intrant.statutIntrant
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                      : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View
                        className={`p-2 rounded-lg mr-3 ${
                          intrant.statutIntrant ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <ShoppingCart
                          size={20}
                          color={intrant.statutIntrant ? "#059669" : "#DC2626"}
                        />
                      </View>
                      <View>
                        <Text
                          className={`font-medium ${
                            intrant.statutIntrant
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          Disponibilité
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {intrant.statutIntrant
                            ? "En stock et disponible à la vente"
                            : "Rupture de stock"}
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`px-4 py-2 rounded-full ${
                        intrant.statutIntrant ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <Text className="text-white font-bold">
                        {intrant.statutIntrant ? "DISPONIBLE" : "INDISPONIBLE"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Carte Statistiques */}
              <View className="w-full px-2">
                <View className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-xl p-4 border border-gray-200">
                  <Text className="text-gray-700 font-medium mb-3">
                    📊 Statistiques
                  </Text>
                  <View className="flex-row justify-between">
                    <View className="items-center">
                      <View className="flex-row items-center mb-1">
                        <Eye size={16} color="#6B7280" className="mr-1" />
                        <Text className="text-gray-600 text-sm">Vues</Text>
                      </View>
                      <Text className="text-2xl font-bold text-gray-800">
                        {intrant.nbreView || 0}
                      </Text>
                    </View>

                    <View className="items-center">
                      <View className="flex-row items-center mb-1">
                        <Calendar size={16} color="#6B7280" className="mr-1" />
                        <Text className="text-gray-600 text-sm">Ajouté le</Text>
                      </View>
                      <Text className="text-lg font-semibold text-gray-800">
                        {new Date(intrant.dateAjout).toLocaleDateString(
                          "fr-FR",
                          { day: "numeric", month: "short" }
                        )}
                      </Text>
                    </View>

                    <View className="items-center">
                      <View className="flex-row items-center mb-1">
                        <Tag size={16} color="#6B7280" className="mr-1" />
                        <Text className="text-gray-600 text-sm">Code</Text>
                      </View>
                      <Text className="text-lg font-semibold text-gray-800 font-mono">
                        {intrant.codeIntrant}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
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
                  `/screen/DashbordScreen/intrants/edit/${intrant.idIntrant}`
                )
              }
              className="flex-1 bg-yellow-500 py-4 rounded-lg items-center"
            >
              <Text className="text-white font-medium">Modifier l'intrant</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={handleShare}
              className="flex-1 bg-gray-200 py-4 rounded-lg items-center"
            >
              <Text className="text-gray-800 font-medium">Partager</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
