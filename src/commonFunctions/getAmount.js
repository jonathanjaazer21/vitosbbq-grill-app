import orderSlipConfig from 'components/SchedulerComponent/orderSlip/orderSlipConfig'

const getAmount = (field) => {
  const { dataSource } = orderSlipConfig.find(data => data.name === field)
  return dataSource[2]
}

export default getAmount
