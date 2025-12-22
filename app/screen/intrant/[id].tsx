import { useIntrant } from "@/context/Intrant";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  DollarSign,
  Globe,
  MapPin,
  Package,
  Phone,
  Scale,
  ShoppingBag,
  Tag,
  User,
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
  const params = useLocalSearchParams();
  const idIntrant = params.id as string;

  console.log("Paramètres reçus:", params);
  console.log("ID Intrant:", idIntrant);

  const { GetAllintrantList, loading, fetchIntrant } = useIntrant();
  const [intrant, setIntrant] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);

  useEffect(() => {
    const loadIntrant = async () => {
      try {
        setLoadingDetail(true);
        console.log("Chargement de l'intrant avec ID:", idIntrant);
        console.log("Liste d'intrants disponibles:", GetAllintrantList.length);

        // Si la liste est vide, la recharger
        if (GetAllintrantList.length === 0) {
          console.log("Rechargement de la liste...");
          await fetchIntrant();
        }

        // Rechercher l'intrant
        const foundIntrant = GetAllintrantList.find(
          (item) => item.idIntrant === idIntrant
        );

        console.log("Intrant trouvé:", foundIntrant);

        if (foundIntrant) {
          setIntrant(foundIntrant);
        } else {
          console.log("Aucun intrant trouvé avec cet ID");
          // Essayer de recharger la liste une dernière fois
          await fetchIntrant();
          const retryIntrant = GetAllintrantList.find(
            (item) => item.idIntrant === idIntrant
          );
          if (retryIntrant) {
            setIntrant(retryIntrant);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoadingDetail(false);
      }
    };

    if (idIntrant) {
      loadIntrant();
    }
  }, [idIntrant]);

  const handleCall = () => {
    if (!intrant?.acteur?.telephoneActeur) return;
    Linking.openURL(`tel:${intrant.acteur.telephoneActeur}`);
  };

  const handleWhatsApp = () => {
    if (!intrant?.acteur?.whatsAppActeur) return;

    const message =
      `Bonjour, je suis intéressé(e) par votre intrant:\n\n` +
      `🏷️ *${intrant.nomIntrant}*\n` +
      `💰 Prix: ${formatPrice(intrant.prixIntrant, intrant.monnaie)}\n` +
      `📦 Quantité: ${intrant.quantiteIntrant} ${intrant.unite}\n\n` +
      `Pouvez-vous me donner plus d'informations ?`;

    const encodedMessage = encodeURIComponent(message);
    Linking.openURL(
      `https://wa.me/${intrant.acteur.whatsAppActeur}?text=${encodedMessage}`
    );
  };

  const handleEmail = () => {
    if (!intrant?.acteur?.emailActeur) return;

    const subject = `Demande d'information - ${intrant.nomIntrant}`;
    const body =
      `Bonjour,\n\nJe suis intéressé(e) par votre intrant "${intrant.nomIntrant}".\n\n` +
      `Prix: ${formatPrice(intrant.prixIntrant, intrant.monnaie)}\n` +
      `Quantité: ${intrant.quantiteIntrant} ${intrant.unite}\n\n` +
      `Pourriez-vous me donner plus d'informations ?\n\nCordialement`;

    Linking.openURL(
      `mailto:${intrant.acteur.emailActeur}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
  };

  const handleShare = async () => {
    if (!intrant) return;

    try {
      const message =
        `Découvrez cet intrant agricole sur KOUMI:\n\n` +
        `🏷️ *${intrant.nomIntrant}*\n` +
        `💰 Prix: ${formatPrice(intrant.prixIntrant, intrant.monnaie)}\n` +
        `📦 Quantité: ${intrant.quantiteIntrant} ${intrant.unite}\n` +
        `📝 ${intrant.descriptionIntrant?.substring(0, 100)}...`;

      await Share.share({
        message,
        title: intrant.nomIntrant,
      });
    } catch (error) {
      console.error("Erreur partage:", error);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copié", `${label} a été copié dans le presse-papier`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: number, monnaie?: any) => {
    if (!price) return "Non spécifié";
    const formatted = new Intl.NumberFormat("fr-FR").format(price);
    return monnaie
      ? `${formatted} ${monnaie.symbole || ""}`
      : `${formatted} FCFA`;
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    return phone.replace(
      /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
      "$1 $2 $3 $4 $5"
    );
  };

  if (loadingDetail || (!intrant && loading)) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">Chargement des détails...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!intrant) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-4">
          <Package size={64} color="#D1D5DB" />
          <Text className="text-gray-800 text-lg font-semibold mt-4">
            Intrant non trouvé
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            L'intrant que vous cherchez n'existe pas ou a été supprimé.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="relative">
          <View className="h-56 bg-gray-100">
            {intrant.photoIntrant ? (
              <Image
                source={{ uri: intrant.photoIntrant }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-gray-200 items-center justify-center">
                <Package size={64} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">Aucune image</Text>
              </View>
            )}

            <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-4 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-md"
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            className="absolute top-12 right-4 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-md"
          >
            <ShoppingBag size={22} color="#374151" />
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-6 pb-8">
          <View className="mb-6">
            <View className="flex-row justify-between items-start">
              <Text className="text-2xl font-bold text-gray-900 flex-1 mr-4">
                {intrant.nomIntrant}
              </Text>
              <View className="bg-primary/10 px-3 py-2 rounded-lg">
                <Text className="text-xl font-bold text-primary">
                  {formatPrice(intrant.prixIntrant, intrant.monnaie)}
                </Text>
              </View>
            </View>

            {intrant.codeIntrant && (
              <Text className="text-gray-500 text-sm mt-1">
                Réf: {intrant.codeIntrant}
              </Text>
            )}
          </View>

          {intrant.descriptionIntrant && (
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">
                Description
              </Text>
              <Text className="text-gray-600 leading-relaxed">
                {intrant.descriptionIntrant}
              </Text>
            </View>
          )}

          {intrant.acteur && (
            <View className="bg-primary/5 rounded-xl p-4 mb-6">
              <Text className="text-gray-700 font-medium mb-3">
                Contacter le vendeur
              </Text>
              <View className="flex-row space-x-3 gap-2">
                {intrant.acteur.telephoneActeur && (
                  <TouchableOpacity
                    onPress={handleCall}
                    className="flex-1 bg-green-600 py-3 rounded-lg items-center"
                  >
                    <View className="flex-row items-center">
                      <Phone size={20} color="white" />
                      <Text className="text-white font-medium ml-2">
                        Appeler
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {intrant.acteur.whatsAppActeur && (
                  <TouchableOpacity
                    onPress={handleWhatsApp}
                    className="flex-1 bg-[#25D366] py-3 rounded-lg items-center"
                  >
                    <View className="flex-row items-center">
                      <FontAwesome name="whatsapp" size={24} color="white" />
                      <Text className="text-white font-medium ml-2">
                        WhatsApp
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {intrant.acteur.emailActeur && (
                <TouchableOpacity
                  onPress={handleEmail}
                  className="mt-3 bg-gray-800 py-3 rounded-lg items-center"
                >
                  <View className="flex-row items-center">
                    <Globe size={20} color="white" />
                    <Text className="text-white font-medium ml-2">
                      Envoyer un email
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-gray-700 font-medium mb-4">
              Détails de l'intrant
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center">
                <Scale size={20} color="#6B7280" className="mr-3" />
                <Text className="text-gray-600 flex-1">
                  Quantité disponible
                </Text>
                <Text className="font-semibold text-gray-800">
                  {intrant.quantiteIntrant} {intrant.unite}
                </Text>
              </View>

              {intrant.categorieProduit && (
                <View className="flex-row items-center">
                  <Tag size={20} color="#6B7280" className="mr-3" />
                  <Text className="text-gray-600 flex-1">Catégorie</Text>
                  <Text className="font-semibold text-gray-800">
                    {intrant.categorieProduit.libelleCategorie}
                  </Text>
                </View>
              )}

              {intrant.forme && (
                <View className="flex-row items-center">
                  <Package size={20} color="#6B7280" className="mr-3" />
                  <Text className="text-gray-600 flex-1">Forme</Text>
                  <Text className="font-semibold text-gray-800">
                    {intrant.forme.libelleForme}
                  </Text>
                </View>
              )}

              <View className="flex-row items-center">
                <DollarSign size={20} color="#6B7280" className="mr-3" />
                <Text className="text-gray-600 flex-1">Prix unitaire</Text>
                <Text className="font-semibold text-gray-800">
                  {formatPrice(intrant.prixIntrant, intrant.monnaie)}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Calendar size={20} color="#6B7280" className="mr-3" />
                <Text className="text-gray-600 flex-1">Date d'expiration</Text>
                <Text className="font-semibold text-gray-800">
                  {formatDate(intrant.dateExpiration)}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Globe size={20} color="#6B7280" className="mr-3" />
                <Text className="text-gray-600 flex-1">Pays d'origine</Text>
                <Text className="font-semibold text-gray-800">
                  {intrant.pays || "Non spécifié"}
                </Text>
              </View>
            </View>
          </View>

          {intrant.acteur && (
            <View className="bg-gray-50 rounded-xl p-4 mb-6">
              <Text className="text-gray-700 font-medium mb-4">
                Informations du vendeur
              </Text>

              <View className="flex-row items-center mb-4">
                <View className="w-14 h-14 bg-primary/10 rounded-full items-center justify-center mr-3">
                  <User size={28} color="#079C48" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 text-lg">
                    {intrant.acteur.nomActeur}
                  </Text>
                  {intrant.acteur.typeActeur?.[0] && (
                    <Text className="text-primary font-medium text-sm">
                      {intrant.acteur.typeActeur[0].libelle}
                    </Text>
                  )}
                </View>
              </View>

              <View className="space-y-3">
                {intrant.acteur.telephoneActeur && (
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(
                        intrant.acteur.telephoneActeur,
                        "Numéro de téléphone"
                      )
                    }
                    className="flex-row items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <View className="flex-row items-center">
                      <Phone size={18} color="#6B7280" />
                      <Text className="text-gray-700 ml-3">Téléphone</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-medium">
                        {formatPhoneNumber(intrant.acteur.telephoneActeur)}
                      </Text>
                      <ChevronRight
                        size={18}
                        color="#9CA3AF"
                        className="ml-2"
                      />
                    </View>
                  </TouchableOpacity>
                )}

                {intrant.acteur.whatsAppActeur && (
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(
                        intrant.acteur.whatsAppActeur,
                        "Numéro WhatsApp"
                      )
                    }
                    className="flex-row items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <View className="flex-row items-center">
                      <FontAwesome name="whatsapp" size={20} color="#25D366" />
                      <Text className="text-gray-700 ml-3">WhatsApp</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-medium">
                        {formatPhoneNumber(intrant.acteur.whatsAppActeur)}
                      </Text>
                      <ChevronRight
                        size={18}
                        color="#9CA3AF"
                        className="ml-2"
                      />
                    </View>
                  </TouchableOpacity>
                )}

                {intrant.acteur.emailActeur && (
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(intrant.acteur.emailActeur, "Email")
                    }
                    className="flex-row items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <View className="flex-row items-center">
                      <Globe size={18} color="#6B7280" />
                      <Text className="text-gray-700 ml-3">Email</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-medium">
                        {intrant.acteur.emailActeur}
                      </Text>
                      <ChevronRight
                        size={18}
                        color="#9CA3AF"
                        className="ml-2"
                      />
                    </View>
                  </TouchableOpacity>
                )}

                {intrant.acteur.adresseActeur && (
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(intrant.acteur.adresseActeur, "Adresse")
                    }
                    className="flex-row items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <View className="flex-row items-center">
                      <MapPin size={18} color="#6B7280" />
                      <Text className="text-gray-700 ml-3">Adresse</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-medium text-right max-w-[60%]">
                        {intrant.acteur.adresseActeur}
                      </Text>
                      <ChevronRight
                        size={18}
                        color="#9CA3AF"
                        className="ml-2"
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {intrant.acteur.speculation &&
                intrant.acteur.speculation.length > 0 && (
                  <View className="mt-4">
                    <Text className="text-gray-700 font-medium mb-2">
                      Spécialisations
                    </Text>
                    <View className="flex-row flex-wrap">
                      {intrant.acteur.speculation.map(
                        (spec: any, index: number) => (
                          <View
                            key={index}
                            className="bg-primary/10 px-3 py-1 rounded-full mr-2 mb-2"
                          >
                            <Text className="text-primary text-sm">
                              {spec.nomSpeculation}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  </View>
                )}
            </View>
          )}

          <View className="mb-6">
            <Text className="text-gray-500 text-sm">
              Publié le {formatDate(intrant.dateAjout)}
            </Text>
            {intrant.nbreView !== undefined && (
              <Text className="text-gray-500 text-sm mt-1">
                {intrant.nbreView} vue{intrant.nbreView !== 1 ? "s" : ""}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <View className="flex-row space-x-3">
          {intrant.acteur?.whatsAppActeur && (
            <TouchableOpacity
              onPress={handleWhatsApp}
              className="flex-1 bg-[#25D366] py-4 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-lg">
                Contacter sur WhatsApp
              </Text>
            </TouchableOpacity>
          )}

          {intrant.acteur?.telephoneActeur && (
            <TouchableOpacity
              onPress={handleCall}
              className="flex-1 bg-primary py-4 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-lg">
                Appeler maintenant
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
