import { useEffect, useState } from 'react'
import { addData, getData } from 'services'

export function useGetDropdownGroup(dropdownName) {
  const [groupDropdowns, setGroupDropdowns] = useState([])
  useEffect(() => {
    loadGroupDropdown()
  }, [])

  const loadGroupDropdown = async () => {
    const result = await getData('groupDropdowns')
    setGroupDropdowns([...result])
  }

  const saveGroupDropdowns = async (list) => {
    const result = await addData({ data: [], collection: dropdownName })
  }

  return [groupDropdowns, saveGroupDropdowns]
}
