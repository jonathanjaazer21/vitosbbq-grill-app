import React, { useEffect, useState } from 'react'
import fields from 'components/fields'
import calculateSubTotal from '../../../commonFunctions/calculateSubTotal'
import Print from 'components/print'

export default function ({ orderSlipConfig, data, menu }) {
  const initialState = () => {
    const _data = {}
    for (const value of menu) {
      const { dataSource } = orderSlipConfig.find(config => config?.name === value)
      const qty = typeof data[value] === 'undefined' ? '0' : data[value]
      _data[value] = { qty, price: dataSource[2] }
    }
    return _data
  }
  const [totals, setTotals] = useState(initialState())
  const [subTotal, setSubTotal] = useState(0)
  const [qty, setQty] = useState(0)

  const menus = orderSlipConfig.map(customProps => {
    if (menu.includes(customProps?.name)) {
      return fields[customProps.type]({ ...data, ...customProps, totals, setTotals: setTotals })
    }
  })

  useEffect(() => {
    const result = calculateSubTotal(totals)
    setQty(result.qty)
    setSubTotal(result.subTotal)
  }, [totals])
  return (
    <div style={{ width: '100%' }}>
      {menus}
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
