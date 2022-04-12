import AnalyticsMonthlySales from "Components/Features/AnalyticsMonthlySales"
import { UnauthorizedContext } from "Error/Unauthorized"
import React, { useContext } from "react"

function MonthlySalesPage() {
  const { user } = useContext(UnauthorizedContext)
  return <AnalyticsMonthlySales user={user} />
}

export default MonthlySalesPage
