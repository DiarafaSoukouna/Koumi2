import { useContext } from "react"
import { IntrantContext } from "./intrantContext"

export default () => {
    const contextInstance = useContext(IntrantContext)
    if (contextInstance === undefined) {
        throw new Error("useIntrant must be used within an IntrantProvider")
    }
    return contextInstance
}