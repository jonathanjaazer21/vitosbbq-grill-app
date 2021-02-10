import React from 'react'
import fields from 'components/fields'
import orderSlipConfig from './orderSlipConfig'
import classes from './orderSlip.module.css'

function OrderSlip (props) {
  return props !== undefined ? (
    <div className={classes.container}>
      {orderSlipConfig.map(customProps =>
        fields[customProps.type]({ ...props, ...customProps })
      )}
    </div>
  ) : (
    <></>
  )
}

export default OrderSlip
