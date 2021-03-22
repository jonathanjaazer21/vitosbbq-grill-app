import DateTimePicker from './dateTimePicker'
import DropdownList from './dropdownList'
import Input from './input'
import {
  CHIPS,
  DATE_PICKER,
  DATE_TIME_PICKER,
  DESCRIPTION,
  DROP_DOWN_LIST,
  HIDDEN,
  INPUT,
  NUMBER
} from './types'
import classes from './index.module.css'
import Chips from './chips'
import DatePicker from './datePicker'
import { Description } from 'containers/0.login/styles'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Number from './number'

const RenderComponent = ({ label, children, isInline, isInlineBlock }) => {
  if (isInline) {
    return (
      <div className={classes.containerInline}>
        <div>
          <label>{label}</label>
        </div>
        <div>{children}</div>
      </div>
    )
  }
  if (isInlineBlock) {
    return (
      <div className={classes.containerBlock}>
        <div>
          <label>{label}</label>
        </div>
        <div>{children}</div>
      </div>
    )
  }

  return (
    <div className={classes.block}>
      <div>
        <label>{label}</label>
      </div>
      <div>{children}</div>
    </div>
  )
}

const DescriptionComponent = props => {
  const prices = [props[props.name], props.dataSource[2]]
  const total = prices[0] * prices[1]
  const [amount, setAmount] = useState(isNaN(total) ? '0.00' : total.toFixed(2))
  const computeHandler = e => {
    const newTotal = e.target.value * prices[1]
    setAmount(newTotal.toFixed(2))
    const qty = isNaN(e.target.value) || e.target.value === '' ? '0' : e.target.value
    props.setTotals({ ...props.totals, [props.name]: { qty, price: props.dataSource[2] } })
  }

  const renderData = (data, index) => {
    if (props.name === 'Header') {
      return data
    }
    if (typeof data === 'string') {
      if (index === 3) {
        return amount
      } else if (index === 2) {
        return data
      } else {
        return data
      }
    }
  }
  return (
    <div className={classes.description}>
      {props.dataSource.map((data, index) => {
        return (
          <div key={data} style={{ width: '100%' }}>
            {typeof data === 'string' ? (
              <div
                style={
                  index >= 2
                    ? {
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }
                    : {}
                }
              >
                {renderData(data, index)}
              </div>
            ) : (
              fields[data.type]({
                ...props,
                onChange: computeHandler
              })
            )}
          </div>
        )
      })}
    </div>
  )
}

const fields = {
  [DATE_TIME_PICKER]: props => {
    return (
      <RenderComponent
        label={props.label}
        isInline={props.isInline}
        isInlineBlock={props.isInlineBlock}
      >
        <DateTimePicker {...props} />
      </RenderComponent>
    )
  },
  [DATE_PICKER]: props => {
    return (
      <RenderComponent
        label={props.label}
        isInline={props.isInline}
        isInlineBlock={props.isInlineBlock}
      >
        <DatePicker {...props} />
      </RenderComponent>
    )
  },
  [DROP_DOWN_LIST]: props => {
    return (
      <RenderComponent {...props} isInline={props.isInline}>
        <DropdownList {...props} />
      </RenderComponent>
    )
  },
  [INPUT]: props => {
    return (
      <RenderComponent {...props}>
        <Input {...props} />
      </RenderComponent>
    )
  },
  [NUMBER]: props => {
    return (
      <RenderComponent {...props}>
        <Number {...props} />
      </RenderComponent>
    )
  },
  [DESCRIPTION]: props => {
    return <DescriptionComponent {...props} />
  },
  [HIDDEN]: props => {
    return (
      <input
        id={props.name}
        className='e-field e-input'
        type='hidden'
        name={props.name}
        style={{ width: '100%' }}
      />
    )
  },
  [CHIPS]: props => {
    return <Chips {...props} />
  }
}

export default fields
