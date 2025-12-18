"use client";

import type React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  loginType,
  registerUser,
  RegisterValues,
} from "../../../functions/auth";
import { getSpeculations } from "../../../functions/speculations/gets";
import { getTypesActeurs } from "../../../functions/types-acteurs/gets";
import ScrollingPage from "./scrolling";

export default function Page() {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const alreadyLaunched = await AsyncStorage.getItem("alreadyLaunched");

        if (alreadyLaunched === null) {
          setIsFirstTime(true);
          await AsyncStorage.setItem("alreadyLaunched", "true");
        } else {
          setIsFirstTime(false);
        }

        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    checkFirstTime();
  }, []);

  if (loading) return null;

  return (
    <View className="flex-1 bg-white">
      {isFirstTime ? <ScrollingPage /> : <LoginPage />}
    </View>
  );
}

const LoginPage = () => {
  const [valuesConnect, setValuesConnect] = useState<loginType>({
    username: "",
    password: "",
  });
  const [valuesRegister, setValuesRegister] = useState<RegisterValues>({
    nomActeur: "",
    username: "",
    adresseActeur: "",
    telephoneActeur: "",
    niveau3PaysActeur: "",
    localiteActeur: "",
    password: "",
    speculation: [],
    typeActeur: [],
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const submitHandler = async () => {
    try {
      if (isRegistering) {
        if (valuesRegister.password !== confirmPassword) {
          alert("Les mots de passe ne correspondent pas.");
          return;
        }
        console.log("Registering user with values:", valuesRegister);
        const res = await registerUser(valuesRegister);
        if (res) {
          router.replace("/profil");
        }
      }
    } catch (error) {
      console.log("Error during submission:", error);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView className="flex-1 bg-gradient-to-b from-orange-50 to-white">
        <ScrollView
          className="flex-1 px-6"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header avec logo centré */}
          <View className="items-center mb-8">
            <View className="bg-white p-4 rounded-3xl shadow-lg shadow-orange-200">
              <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: 140, height: 88 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-2xl font-bold mt-6 text-gray-800 text-center">
              Bienvenue sur Koumi 👋
            </Text>
          </View>

          {/* Formulaire */}
          <View className="flex-1">
            {isRegistering ? (
              <RegisterInputs
                values={valuesRegister}
                setValues={setValuesRegister}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
              />
            ) : (
              <LoginInputs
                values={valuesConnect}
                setValues={setValuesConnect}
              />
            )}
          </View>

          {/* Boutons */}
          <View className="mt-5">
            <TouchableOpacity
              className="bg-orange-500 py-4 rounded-2xl shadow-lg shadow-orange-300"
              activeOpacity={0.8}
              onPress={() => submitHandler()}
            >
              <Text className="text-white text-center text-lg font-bold">
                {isRegistering ? "Créer mon compte" : "Se connecter"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsRegistering(!isRegistering)}
              className="bg-gray-100 py-4 rounded-2xl mt-3 border border-gray-200"
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 text-center text-lg font-semibold">
                {isRegistering ? "J'ai déjà un compte" : "Créer un compte"}
              </Text>
            </TouchableOpacity>

            {!isRegistering && (
              <TouchableOpacity className="mt-4" activeOpacity={0.7}>
                <Text className="text-orange-500 text-center text-base font-medium">
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

interface LoginInputsProps {
  values: loginType;
  setValues: React.Dispatch<React.SetStateAction<loginType>>;
}

const LoginInputs: React.FC<LoginInputsProps> = ({ values, setValues }) => {
  return (
    <View className="gap-4">
      <View>
        <Text className="text-gray-600 font-medium mb-2 ml-1">Téléphone</Text>
        <TextInput
          placeholder="Entrez votre numéro"
          placeholderTextColor="#9CA3AF"
          value={values.username}
          onChangeText={(text) => setValues({ ...values, username: text })}
          className="bg-white border-2 border-gray-100 p-4 rounded-xl text-base text-gray-800"
          style={{ fontSize: 16 }}
        />
      </View>

      <View>
        <Text className="text-gray-600 font-medium mb-2 ml-1">
          Mot de passe
        </Text>
        <TextInput
          placeholder="Entrez votre mot de passe"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={values.password}
          onChangeText={(text) => setValues({ ...values, password: text })}
          className="bg-white border-2 border-gray-100 p-4 rounded-xl text-base text-gray-800"
          style={{ fontSize: 16 }}
        />
      </View>
    </View>
  );
};

interface RegisterInputsProps {
  values: RegisterValues;
  setValues: React.Dispatch<React.SetStateAction<RegisterValues>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

const RegisterInputs: React.FC<RegisterInputsProps> = ({
  values,
  setValues,
  confirmPassword,
  setConfirmPassword,
}) => {
  const [typesActeurs, setTypesActeurs] = useState([]);
  const [speculations, setSpeculations] = useState([]);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [specModalVisible, setSpecModalVisible] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [searchSpec, setSearchSpec] = useState("");

  const getSpreculation = async () => {
    try {
      const response = await getSpeculations();
      setSpeculations(response);
    } catch (error) {
      console.log("Error fetching speculations:", error);
    }
  };
  const getTypesActeur = async () => {
    try {
      const response = await getTypesActeurs();
      setTypesActeurs(response);
    } catch (error) {
      console.log("Error fetching types acteurs:", error);
    }
  };

  useEffect(() => {
    getSpreculation();
    getTypesActeur();
  }, []);
  return (
    <>
      <View className="gap-3">
        {/* Nom et Prénom côte à côte */}

        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">
            Nom acteur
          </Text>
          <TextInput
            placeholder="Votre nom"
            placeholderTextColor="#9CA3AF"
            value={values.nomActeur}
            onChangeText={(text) => setValues({ ...values, nomActeur: text })}
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>
        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">
            Nom d'utilisateur
          </Text>
          <TextInput
            placeholder="Votre nom d'utilisateur"
            placeholderTextColor="#9CA3AF"
            value={values.username}
            onChangeText={(text) => setValues({ ...values, username: text })}
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>

        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">Téléphone</Text>
          <TextInput
            placeholder="Numéro de téléphone"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            value={values.telephoneActeur}
            onChangeText={(text) =>
              setValues({ ...values, telephoneActeur: text })
            }
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>

        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">Adresse</Text>
          <TextInput
            placeholder="Votre adresse"
            placeholderTextColor="#9CA3AF"
            value={values.adresseActeur}
            onChangeText={(text) =>
              setValues({ ...values, adresseActeur: text })
            }
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>

        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">Localité</Text>
          <TextInput
            placeholder="Localité"
            placeholderTextColor="#9CA3AF"
            value={values.localiteActeur}
            onChangeText={(text) =>
              setValues({ ...values, localiteActeur: text })
            }
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>

        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">
            Niveau 3 Pays
          </Text>
          <TextInput
            placeholder="Niveau 3"
            placeholderTextColor="#9CA3AF"
            value={values.niveau3PaysActeur}
            onChangeText={(text) =>
              setValues({ ...values, niveau3PaysActeur: text })
            }
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>

        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">
            Type d'acteur
          </Text>
          <TouchableOpacity
            onPress={() => setTypeModalVisible(true)}
            className="bg-white border-2 border-gray-100 p-4 rounded-xl"
          >
            <Text className="text-gray-700">
              {values.typeActeur.length === 0
                ? "Sélectionnez un ou plusieurs types"
                : `${values.typeActeur.length} sélectionné(s)`}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">
            Spéculation
          </Text>
          <TouchableOpacity
            onPress={() => setSpecModalVisible(true)}
            className="bg-white border-2 border-gray-100 p-4 rounded-xl"
          >
            <Text className="text-gray-700">
              {values.speculation.length === 0
                ? "Sélectionnez une ou plusieurs spéculations"
                : `${values.speculation.length} sélectionnée(s)`}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">
            Mot de passe
          </Text>
          <TextInput
            placeholder="Créez un mot de passe"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={values.password}
            onChangeText={(text) => setValues({ ...values, password: text })}
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>

        <View>
          <Text className="text-gray-600 font-medium mb-2 ml-1">
            Confirmation
          </Text>
          <TextInput
            placeholder="Confirmez le mot de passe"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>
      </View>
      {/* Type d'acteur modal */}
      <Modal
        transparent
        visible={typeModalVisible}
        animationType="fade"
        onRequestClose={() => setTypeModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <View className="bg-white w-full rounded-2xl p-4 max-h-[80%]">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Sélectionnez les types d'acteur
            </Text>
            <TextInput
              placeholder="Rechercher..."
              placeholderTextColor="#9CA3AF"
              onChangeText={setSearchType}
              className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 mb-3"
              style={{ fontSize: 15 }}
            />
            <ScrollView className="max-h-[55%]">
              {typesActeurs
                .filter((t: any) =>
                  t.libelle.toLowerCase().includes(searchType.toLowerCase())
                )
                .map((t: any) => {
                  const checked = values.typeActeur.some(
                    (item) => item.idTypeActeur === t.idTypeActeur
                  );
                  return (
                    <TouchableOpacity
                      key={t.idTypeActeur}
                      onPress={() => {
                        if (checked) {
                          setValues({
                            ...values,
                            typeActeur: values.typeActeur.filter(
                              (item) => item.idTypeActeur !== t.idTypeActeur
                            ),
                          });
                        } else {
                          setValues({
                            ...values,
                            typeActeur: [
                              ...values.typeActeur,
                              { idTypeActeur: t.idTypeActeur },
                            ],
                          });
                        }
                      }}
                      className="flex-row items-center py-3"
                    >
                      <View
                        className={`w-5 h-5 mr-3 rounded border ${
                          checked
                            ? "bg-orange-500 border-orange-500"
                            : "border-gray-400"
                        }`}
                      />
                      <Text className="text-gray-700">{t.libelle}</Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            <TouchableOpacity
              className="mt-2 bg-orange-500 py-3 rounded-xl"
              onPress={() => setTypeModalVisible(false)}
            >
              <Text className="text-center text-white font-bold">Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Spéculation modal */}
      <Modal
        transparent
        visible={specModalVisible}
        animationType="fade"
        onRequestClose={() => setSpecModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <View className="bg-white w-full rounded-2xl p-4 max-h-[80%]">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Sélectionnez les spéculations
            </Text>
            <TextInput
              placeholder="Rechercher..."
              placeholderTextColor="#9CA3AF"
              onChangeText={setSearchSpec}
              className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 mb-3"
              style={{ fontSize: 15 }}
            />
            <ScrollView className="max-h-[55%]">
              {speculations
                .filter((s: any) =>
                  s.nomSpeculation
                    .toLowerCase()
                    .includes(searchSpec.toLowerCase())
                )
                .map((s: any) => {
                  const checked = values.speculation.some(
                    (item) => item.idSpeculation === s.idSpeculation
                  );
                  return (
                    <TouchableOpacity
                      key={s.idSpeculation}
                      onPress={() => {
                        if (checked) {
                          setValues({
                            ...values,
                            speculation: values.speculation.filter(
                              (item) => item.idSpeculation !== s.idSpeculation
                            ),
                          });
                        } else {
                          setValues({
                            ...values,
                            speculation: [
                              ...values.speculation,
                              { idSpeculation: s.idSpeculation },
                            ],
                          });
                        }
                      }}
                      className="flex-row items-center py-3"
                    >
                      <View
                        className={`w-5 h-5 mr-3 rounded border ${
                          checked
                            ? "bg-orange-500 border-orange-500"
                            : "border-gray-400"
                        }`}
                      />
                      <Text className="text-gray-700">{s.nomSpeculation}</Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            <TouchableOpacity
              className="mt-2 bg-orange-500 py-3 rounded-xl"
              onPress={() => setSpecModalVisible(false)}
            >
              <Text className="text-center text-white font-bold">Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
