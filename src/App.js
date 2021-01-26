import FilteringPanel from 'components/filteringPanel/filteringPanel'
import React from 'react'
import classes from './app.module.css'
import ScheduleComponent from './components/schedulerComponent/schedulerComponent'

function App () {
  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <div className={classes.leftContent}>
          <ScheduleComponent />
        </div>
        <div className={classes.rightContent}>
          <div className={classes.fixedSideBar}>
            <FilteringPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
