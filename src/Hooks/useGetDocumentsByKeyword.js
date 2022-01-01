import { UnavailableContext } from "Error/Unavailable"
import { UnauthorizedContext } from "Error/Unauthorized"
import { useContext, useEffect, useState } from "react"

export default function useGetDocumentsByKeyword(ServiceClass) {
  const { user } = useContext(UnauthorizedContext)
  const { setError, setIsLoading, setLoaded } = useContext(UnavailableContext)
  const [data, setData] = useState([])
  const loadData = async (fieldname, value) => {
    setLoaded(false)
    setIsLoading(true)
    try {
      let _data = []
      switch (fieldname) {
        case ServiceClass.MODE_PAYMENT:
          _data = await ServiceClass.getDataByKeyword(
            fieldname,
            value,
            user.branchSelected
          )
        case ServiceClass.SOURCE:
          _data = await ServiceClass.getDataByKeyword(
            fieldname,
            value,
            user.branchSelected
          )
        case ServiceClass.REVENUE_CHANNEL:
          if (value === "DR") {
            _data = await ServiceClass.getDataNotEqualToFieldname(
              ServiceClass.ORDER_VIA,
              "",
              user.branchSelected
            )
            setData(_data)
            setIsLoading(false)
            setLoaded(true)
            return
          } else if (value === "PP") {
            _data = await ServiceClass.getDataNotEqualToFieldname(
              ServiceClass.ORDER_VIA_PARTNER,
              "",
              user.branchSelected
            )
            setData(_data)
            setIsLoading(false)
            setLoaded(true)
            return
          } else {
            _data = await ServiceClass.getDataNotEqualToFieldname(
              ServiceClass.ORDER_VIA_WEBSITE,
              "",
              user.branchSelected
            )
            setData(_data)
            setIsLoading(false)
            setLoaded(true)
            return
          }

        case ServiceClass.SALES_TYPE:
          if (value === "D/O") {
            _data = await ServiceClass.getDataOthers(
              "Automatic 50 percent off",
              "",
              user.branchSelected
            )
            const filteredData = _data.filter(
              (obj) => obj[ServiceClass.ORDER_VIA]
            )
            setData(filteredData)
            setIsLoading(false)
            setLoaded(true)
            return
          }

          if (value === "D/PM") {
            _data = await ServiceClass.getDataOthers(
              "Promo",
              "",
              user.branchSelected
            )
            const filteredData = _data.filter(
              (obj) => obj[ServiceClass.ORDER_VIA]
            )
            setData(filteredData)
            setIsLoading(false)
            setLoaded(true)
            return
          }

          if (value === "D/IR") {
            _data = await ServiceClass.getDataOthers(
              "Incidents",
              "",
              user.branchSelected
            )
            const filteredData = _data.filter(
              (obj) => obj[ServiceClass.ORDER_VIA]
            )
            setData(filteredData)
            setIsLoading(false)
            setLoaded(true)
            return
          }

          if (value === "D/S") {
            _data = await ServiceClass.getDataOthers(
              "Special",
              "",
              user.branchSelected
            )
            const filteredData = _data.filter(
              (obj) => obj[ServiceClass.ORDER_VIA]
            )
            setData(filteredData)
            setIsLoading(false)
            setLoaded(true)
            return
          }

          if (value === "SPWD") {
            _data = await ServiceClass.getDataOthers(
              "Senior Citizen",
              "",
              user.branchSelected
            )
            setData(_data)
            setIsLoading(false)
            setLoaded(true)
            return
          }

          if (value === "R") {
            _data = await ServiceClass.getDataNotEqualToFieldname(
              ServiceClass.ORDER_VIA,
              "",
              user.branchSelected
            )
            const filteredData = _data.filter(
              (obj) => Object.keys(obj?.others || {}).length === 0
            )
            setData(filteredData)
            setIsLoading(false)
            setLoaded(true)
            return
          }
          return
        default:
          _data = await ServiceClass.getDataByKeyword(
            fieldname,
            value,
            user.branchSelected
          )
      }
      setData(_data)
      setIsLoading(false)
      setLoaded(true)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
      setLoaded(true)
    }
  }
  const clearData = () => {
    setData([])
  }
  return [data, loadData, clearData]
}
