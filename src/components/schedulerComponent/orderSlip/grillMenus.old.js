import React, { useEffect, useState } from 'react'
import fields from 'components/fields'
import calculateSubTotal from '../../../commonFunctions/calculateSubTotal'
import Print from 'components/print'
import { MENU_GROUP_HEADERS } from './types'
import { DESCRIPTION } from 'components/fields/types'

export default function ({ orderSlipConfig, data, menu }) {
  const initialState = () => {
    const _data = {}
    for (const value of orderSlipConfig) {
      // const { dataSource } = orderSlipConfig.find(config => config?.name === value?.name)
      const qty = typeof data[value?.name] === 'undefined' ? '0' : data[value?.name]
      _data[value?.name] = { qty, price: '0' }
    }
    return _data
  }
  const [totals, setTotals] = useState(initialState())
  const [subTotal, setSubTotal] = useState(0)
  const [qty, setQty] = useState(0)

  const menus = orderSlipConfig.map(customProps => {
    if (customProps?.type === DESCRIPTION) {
      return customProps?.name === MENU_GROUP_HEADERS
        ? <div style={{ paddingTop: '1rem', width: '100%', color: 'red' }}>{customProps?.label}</div>
        : fields[customProps.type]({ ...data, ...customProps, totals, setTotals: setTotals })
    }
  })
  useEffect(() => {
    const result = calculateSubTotal(totals)
    setQty(result.qty)
    setSubTotal(result.subTotal)
  }, [totals])
  return (
    <div style={{ width: '100%' }}>
      {/* {menus} */}
      <br />
      <br />
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ flex: '1' }}>Total</div>
        <div style={{ flex: '1' }}>{qty}</div>
        <div style={{ flex: '1' }} />
        <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>{subTotal}</div>
      </div>
      <br />
      <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
        <Print
          orderSlipConfig={orderSlipConfig}
          data={data}
          menu={menu}
          totals={totals}
          subTotal={subTotal}
          qty={qty}
        />
      </div>
    </div>
  )
}
