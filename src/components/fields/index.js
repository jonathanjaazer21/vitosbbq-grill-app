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
  INPUT
} from './types'
import classes from './index.module.css'
import Chips from './chips'
import DatePicker from './datePicker'

const RenderComponent = ({ label, children, isInline }) => {
  return isInline ? (
    <div className={classes.containerInline}>
      <div>
        <label>{label}</label>
      </div>
      <div>{children}</div>
    </div>
  ) : (
    <div className={classes.containerBlock}>
      <div>
        <label>{label}</label>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default {
  [DATE_TIME_PICKER]: props => {
    return (
      <RenderComponent label={props.label} isInline={props.isInline}>
        <DateTimePicker {...props} />
      </RenderComponent>
    )
  },
  [DATE_PICKER]: props => {
    return (
      <RenderComponent label={props.label} isInline={props.isInline}>
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
      <RenderComponent {...props} isInline={props.isInline}>
        <Input {...props} />
      </RenderComponent>
    )
  },
  [DESCRIPTION]: props => {
    return (
      <div className={classes.description}>
        {props.dataSource.map(data => (
          <div key={data}>{data}</div>
        ))}
      </div>
    )
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
