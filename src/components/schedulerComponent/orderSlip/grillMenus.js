import React, { useState, useEffect } from 'react'
import { Item, Wrapper, Container } from './styles'
import Input from 'components/fields/input'
import { getData } from 'services'
import { PRODUCTS } from 'services/collectionNames'

import Print from 'components/print'
import sort from 'commonFunctions/sort'

const Header = () => {
  return (
    <div style={{ padding: '.3rem' }}>
      <Container>
        <Item>
          Code
        </Item>
        <Item>
          Product
        </Item>
        <Item right>
          Price
        </Item>
        <Item right>
          Qty
        </Item>
        <Item right>
          Total
        </Item>
      </Container>
    </div>
  )
}

const Product = ({ groupHeader, productList, productData, setProductData }) => {
  return (
    <div>
      <div style={{ padding: '.3rem', color: 'red' }}>{groupHeader}</div>
      {productList.map(data => {
        const total = parseInt(productData[data?.code][0]) * parseInt(data?.price)
        return (
          <Container key={data?.code}>
            <Item>
              {data?.code}
            </Item>
            <Item>
              {data?.description}
            </Item>
            <Item right>
              {data?.price.toFixed(2)}
            </Item>
            <Item right>
              <div style={{ marginTop: '-.3rem', paddingLeft: '2rem' }}>
                <Input
                  isNumber
                  name={data?.code}
                  onChange={(e) => { setProductData(e, data?.code, data?.price) }}
                  value={productData && productData[data?.code][0]}
                />
              </div>
            </Item>
            <Item right>
              {total.toFixed(2)}
            </Item>
          </Container>
        )
      })}
    </div>
  )
}

const Footer = ({ total }) => {
  return (
    <Container>
      <Item>
        Total
      </Item>
      <Item right>
        {total.toFixed(2)}
      </Item>
    </Container>
  )
}
export default function (props) {
  const [productList, setProductList] = useState([])
  const [productData, setProductData] = useState({})

  const handleChange = (e, code, price) => {
    if (e.target.value === '') {
      setProductData({ ...productData, [code]: ['0', price] })
    } else {
      setProductData({ ...productData, [code]: [e.target.value, price] })
    }
  }

  const calculateSubTotal = (productDataList) => {
    let subTotal = 0

    for (const array in productDataList) {
      subTotal += parseInt(productDataList[array][1]) * parseInt(productDataList[array][0])
    }
    return subTotal
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const productData = {}
    const result = await getData(PRODUCTS)
    for (const obj of result) {
      for (const product of obj.productList) {
        productData[product.code] = props[product.code] ? [parseInt(props[product.code]), product?.price] : [0, product?.price]
      }
    }
    setProductData(productData)
    setProductList(sort(result, 'no'))
  }

  return (
    <Wrapper>
      <Header />
      {productList.map(data =>
        <Product
          key={data?.groupHeader}
          groupHeader={data?.groupHeader}
          productList={data?.productList}
          productData={productData}
          setProductData={handleChange}
        />)}
      <Footer total={calculateSubTotal(productData)} />
      <Print data={props} totals={productData} subTotal={calculateSubTotal(productData)} productList={productList} />
    </Wrapper>
  )
}
