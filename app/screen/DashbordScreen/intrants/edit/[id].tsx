import { useIntrant } from "@/context/Intrant";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import AddIntrantScreen from "../../form/AddIntrantScreen";

export default function EditIntrantScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { GetAllIntranByActeur } = useIntrant();

  // Trouver l'intrant à éditer
  const intrantToEdit = GetAllIntranByActeur.find(
    (item) => item.idIntrant === id
  );

  useEffect(() => {
    if (!intrantToEdit && id) {
      // Rediriger si l'intrant n'existe pas
      router.back();
    }
  }, [intrantToEdit, id]);

  if (!intrantToEdit) {
    return null; // ou un écran de chargement
  }

  return (
    <AddIntrantScreen
      intrantToEdit={intrantToEdit}
      onSuccess={() => router.back()}
    />
  );
}
