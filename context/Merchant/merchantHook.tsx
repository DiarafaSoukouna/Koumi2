import { useContext } from "react"
import { MerchantContext } from "./merchantContext"

export default () => {
    const context = useContext(MerchantContext)
    if (context === undefined) {
        throw new Error("useMerchant must be used within a MerchantProvider")
    }

    return context
}