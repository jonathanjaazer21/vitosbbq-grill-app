import React from "react"
import useSchedulerHook from "./hooks"
import SchedulerComponent from "components/SchedulerComponent"

function DashboardScheduler() {
  const [navigate, handleNavigate] = useSchedulerHook()
  return (
    <SchedulerComponent
      setLoading={() => {}}
      navigate={navigate}
      handleNavigate={handleNavigate}
    />
  )
}

export default DashboardScheduler
