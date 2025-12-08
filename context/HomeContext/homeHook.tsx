import { useContext } from "react"
import { HomeContext } from "./homeContext"
export default () => {
    const contextInstance = useContext(HomeContext)
    if (contextInstance === undefined) {
        throw new Error("useHomeContext must be used within a HomeProvider")
    }
    return contextInstance
}
