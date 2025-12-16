import HomeProvider from "@/context/HomeContext/homeProvider";
import HomeScreen from "../screen/HomeScreen";

export default function TestHome() {
  return (
    <HomeProvider>
      <HomeScreen />
    </HomeProvider>
  );
}
