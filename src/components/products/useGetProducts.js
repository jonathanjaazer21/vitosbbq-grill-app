import sort from 'commonFunctions/sort'
import { useEffect, useState } from 'react'
import { getData } from 'services'
import { PRODUCTS } from 'services/collectionNames'

export const useGetProducts = () => {
  const [products, setProducts] = useState([])
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const result = await getData(PRODUCTS)
    setProducts(sort(result, 'no'))
  }

  const handleChange = () => {
    alert('changed detected')
  }
  return [products, handleChange]
}
