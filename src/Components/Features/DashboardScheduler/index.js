import React from "react"
import useSchedulerHook from "./hooks"
import Scheduler from "./Scheduler"

function DashboardScheduler() {
  const [navigate, handleNavigate] = useSchedulerHook()
  console.log("navigate", navigate)
  return (
    <Scheduler
      setLoading={() => {}}
      navigate={navigate}
      handleNavigate={handleNavigate}
    />
  )
}

export default DashboardScheduler
