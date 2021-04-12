import { useState, useEffect } from 'react'
import { getData, updateData } from 'services'
import { USERS } from 'services/collectionNames'

export function useGetUsers (props) {
  const [users, setUsers] = useState({})
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const data = {}
    const result = await getData(USERS)
    for (const obj of result) {
      data[obj._id] = {
        ...obj
      }
    }
    setUsers(data)
  }

  const handleSave = (roles, branches, id) => {
    const data = { ...users[id] }
    data.roles = roles
    data.branches = branches
    updateData({ collection: USERS, id, data })
    setUsers({ ...users, [id]: data })
  }

  const handleAdd = ({ email, name }) => {
    setUsers({ ...users, [email]: { _id: email, name, branches: [], roles: [], isEnabled: true } })
  }
  return [users, handleSave, handleAdd]
}
