import React, { useEffect } from 'react'
import classes from './app.module.css'
import ScheduleComponent from './components/schedulerComponent/schedulerComponent'

function App () {
  return (
    <div className='App'>
      <div className={classes.container}>
        <div className={classes.leftContent}>
          <ScheduleComponent />
        </div>
        {/* <div className={classes.rightContent}>
          <div style={{ width: '320px' }}>Right Content</div>
        </div> */}
      </div>
    </div>
  )
}

export default App
