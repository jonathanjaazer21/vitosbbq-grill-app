import { Panel, Wrapper, Footer } from './styles'
import React, { useEffect } from 'react'
import { useGetProducts } from './useGetProducts'
import { Container } from 'commonStyles'
import { Button } from 'antd'
import Table, { toolbarOptions, editSettings } from './table'

export function Products (props) {
  const [products, handleChange] = useGetProducts()
  const columns = [
    {
      headerText: 'Code',
      field: 'code',
      isPrimaryKey: true
    },
    {
      headerText: 'Description',
      field: 'description'
    },
    {
      headerText: 'Price',
      field: 'price'
    }
  ]
  return (
    <Wrapper>
      {products.map(data => {
        return (
          <Panel key={data.groupHeader}>
            <Container>
              <div>
                {data.groupHeader}
              </div>
              <br />
              <Table
                id={data._id}
                productList={data.productList}
                columns={columns}
                toolbar={toolbarOptions}
                editSettings={editSettings}
              />
              <br />
            </Container>
          </Panel>
        )
      })}
    </Wrapper>
  )
}
