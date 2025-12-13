import { useContext } from "react"
import { TransporteurContext } from "./transporteurContext"

export default () => {
    const context = useContext(TransporteurContext)
    if (context === undefined) {
        throw new Error("useTransporteur must be used within a TransporteurProvider")
    }

    return context
}