import HomeProvider from "@/context/HomeContext/homeProvider";
import MagasinListScreen from "../screen/MagasinListScreen";

export default function Magasin() {
    return (
        <HomeProvider>
            <MagasinListScreen />
        </HomeProvider>
    );
}