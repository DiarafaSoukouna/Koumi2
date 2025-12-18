import { HomeProvider } from "@/context/HomeContext";
import HomeScreen from "../screen/HomeScreen";

export default function HomeScreens() {
  return (
    <HomeProvider>
      <HomeScreen />
    </HomeProvider>
  );
}
