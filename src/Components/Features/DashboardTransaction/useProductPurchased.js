import {
  producedProductListOfAllCodes,
  producedProductListWithGroupAndAmounts,
} from "Helpers/collectionData"
import sumArray from "Helpers/sumArray"
import useGetDocuments from "Hooks/useGetDocuments"
import React, { useEffect, useState } from "react"
import NewProductsClass from "Services/Classes/NewProductsClass"
import ProductsClass from "Services/Classes/ProductsClass"
import SchedulersClass from "Services/Classes/SchedulesClass"
import SpecificPricesClass from "Services/Classes/SpecificPricesClass"
import productStaticPrices from "./productStaticPrices"
export default function useProductPurchased(
  orderData,
  orderVia = "",
  formType
) {
  const [data] = useGetDocuments(ProductsClass)
  const [newProductData] = useGetDocuments(NewProductsClass)
  const [editableId, setEditableId] = useState(null)
  const [codeObjList, setCodeObjList] = useState([])
  const [productList, setProductList] = useState([])
  const [products, setProducts] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [totalDue, setTotalDue] = useState(0)
  const [isTouched, setIsTouched] = useState(false)
  const [specificPrices, setSpecificPrices] = useState([])

  useEffect(() => {
    loadSpecificPrices()
  }, [])

  const loadSpecificPrices = async () => {
    const _specificPrices = await SpecificPricesClass.getData()
    setSpecificPrices(_specificPrices)
  }

  // this is for active product button selected load when modified
  useEffect(() => {
    if (orderData) {
      const productList = producedProductListOfAllCodes(data)
      const checkedProductCodes = []
      for (const key of productList) {
        if (typeof orderData[key] !== "undefined") {
          if (Number(orderData[key]) > 0) {
            checkedProductCodes.push(key)
          }
        }
      }
      loadProductStates(data, checkedProductCodes)
    }
  }, [orderData, codeObjList])

  // this is for product class loading
  useEffect(() => {
    produceCodeObjList(specificPrices)
  }, [data, newProductData, orderVia, specificPrices])

  const produceCodeObjList = async (_specificPrices) => {
    if (data.length > 0 || newProductData.length > 0) {
      setProductList(data)
      loadProductStates(data)

      const _codeObjList = []
      const addFlexPrices =
        formType === "add" ? { withFlexiblePrices: true } : {}
      const _orderData = { ...orderData, ...addFlexPrices }

      if (_orderData?.withFlexiblePrices && newProductData.length > 0) {
        setProductList(newProductData)
        loadProductStates(newProductData)
        for (const { productList = [] } of newProductData) {
          for (const obj of productList) {
            const productObj = { ...obj }
            const price = productStaticPrices(
              orderVia,
              obj?.code,
              obj?.price,
              _specificPrices
            )
            productObj.price = price
            productObj[`customPrice${obj?.code}`] = price
            if (typeof _orderData[`customPrice${obj?.code}`] !== "undefined") {
              productObj[`customPrice${obj?.code}`] =
                _orderData[`customPrice${obj?.code}`]
            }
            _codeObjList.push({ ...productObj })
          }
        }
        setCodeObjList(_codeObjList)
      }
      if (
        typeof _orderData?.withFlexiblePrices === "undefined" &&
        data.length > 0
      ) {
        for (const { productList = [] } of data) {
          for (const obj of productList) {
            const productObj = { ...obj }
            productObj.price = productStaticPrices(
              orderVia,
              obj?.code,
              obj?.price
            )
            _codeObjList.push(productObj)
          }
        }
        setCodeObjList(_codeObjList)
      }
    }
  }

  useEffect(() => {
    if (codeObjList) {
      const _dataSource = []
      for (const code in products) {
        if (products[code]) {
          const _data = codeObjList.find(
            (obj) => obj[ProductsClass.CODE] === code
          )
          const isDataExist = dataSource.find(
            (obj) => obj[ProductsClass.CODE] === code
          )

          if (!isDataExist) {
            let ifPriceEditable =
              _data[ProductsClass.PRICE] === 0
                ? {
                    editable: true,
                    [`customPrice${code}`]:
                      orderData[`customPrice${code}`] || 0,
                    price: orderData[`customPrice${code}`] || 0,
                  }
                : {}

            if (
              (orderVia || "").includes("DN") ||
              (orderVia || "").includes("DD") ||
              (orderVia || "").includes("FP") ||
              (orderVia || "").includes("ZAP") ||
              (orderVia || "").includes("GBF") ||
              (orderVia || "").includes("MMF")
            ) {
            } else {
              if (
                typeof orderData[SchedulersClass.WITH_FLEXIBLE_PRICES] !==
                  "undefined" &&
                _data[ProductsClass.PRICE] !== 0
              ) {
                ifPriceEditable = {
                  editable: false,
                  [`customPrice${code}`]:
                    orderData[`customPrice${code}`] || _data?.price,
                  price: orderData[`customPrice${code}`] || _data?.price,
                }
              }

              if (formType === "add") {
                ifPriceEditable = {
                  editable: _data[ProductsClass.PRICE] === 0 ? true : false,
                  [`customPrice${code}`]: _data?.price,
                  price: _data?.price,
                }
              }
            }

            _dataSource.push({
              ..._data,
              qty: orderData[code] > 0 ? orderData[code] : 1,
              ...ifPriceEditable,
            })
          } else {
            _dataSource.push({ ...isDataExist })
          }
        }
      }
      setDataSource(_dataSource)
      handleTotalDue(_dataSource)
    }
  }, [products])
  console.log("dataSource", dataSource)

  const handleTotalDue = (_dataSource) => {
    //this is for total due
    let _totalDue = 0
    for (const obj of _dataSource) {
      _totalDue = _totalDue + Number(obj?.price) * Number(obj?.qty)
    }
    setTotalDue(_totalDue)
  }

  const addProduct = (code, checked) => {
    const _products = { ...products }
    _products[code] = checked
    setProducts(_products)
    setIsTouched(true)
  }

  const loadProductStates = (_data, checkedProducts = []) => {
    const list = producedProductListOfAllCodes(_data)
    const _products = {}
    for (const code of list) {
      if (checkedProducts.includes(code)) {
        _products[code] = true
      } else {
        _products[code] = false
      }
    }

    setProducts(_products)
  }

  const handleEditing = (value, fieldName) => {
    if (fieldName === "qty") {
      if (isNaN(value)) return
      if (Number(value) < 0) return
    }
    const _dataSource = [...dataSource]
    const dataIndex = dataSource.findIndex((obj) => obj?.code === editableId)
    const dataSourceObj = { ..._dataSource[dataIndex] }
    dataSourceObj[fieldName] = Number(value)
    _dataSource[dataIndex] = dataSourceObj
    setDataSource(_dataSource)
    handleTotalDue(_dataSource)
    setIsTouched(true)
  }

  const handleEditPrice = (e) => {
    const value = e.target.value
    if (isNaN(value)) return
    if (Number(value) < 0) return
    const _dataSource = [...dataSource]
    const dataIndex = dataSource.findIndex((obj) => obj?.code === editableId)
    const dataSourceObj = { ..._dataSource[dataIndex] }
    dataSourceObj[`customPrice${editableId}`] = Number(value)
    dataSourceObj.price = Number(value)
    _dataSource[dataIndex] = dataSourceObj
    setDataSource(_dataSource)
    handleTotalDue(_dataSource)
    setIsTouched(true)
  }

  return {
    products,
    addProduct,
    productList,
    codeObjList,
    dataSource,
    handleEditing,
    handleEditPrice,
    editableId,
    setEditableId,
    totalDue,
    isTouched,
  }
}
