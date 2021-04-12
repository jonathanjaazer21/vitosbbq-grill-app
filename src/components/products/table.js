import * as React from 'react'
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Page,
  ExcelExport,
  Group,
  PdfExport,
  Edit,
  Inject,
  Search,
  Toolbar
} from '@syncfusion/ej2-react-grids'
import { addData, deleteData, updateData } from 'services'
import { PRODUCTS } from 'services/collectionNames'
const Table = (props) => {
  const [productList, setProductList] = React.useState([])
  const contextMenuItems = [
    'AutoFit',
    'AutoFitAll',
    'SortAscending',
    'SortDescending',
    'Copy',
    'Edit',
    'Delete',
    'Save',
    'Cancel',
    'PdfExport',
    'ExcelExport',
    'CsvExport',
    'FirstPage',
    'PrevPage',
    'LastPage',
    'NextPage'
  ]

  React.useEffect(() => {
    setProductList(props.productList)
  }, [props])
  const onActionBegin = e => {
    const { requestType, data, action } = e
    if (requestType === 'save') {
      if (action === 'add') {
        const dataCopy = { ...data }
        let productList = [...props.productList]
        if (props.productList.some(product => product?.code === dataCopy?.code)) {
          productList = productList.filter(prod => prod?.code !== dataCopy?.code)
        }
        const productListConvertedPriceToNumber = productList.map(product => {
          return {
            ...product,
            price: parseInt(product.price)
          }
        })
        setProductList(productList)
        const updatedProductList = [...productListConvertedPriceToNumber, { ...data, description: data.description || 'EMPTY', price: parseInt(data.price) || 0 }]
        updateData({
          data: { productList: updatedProductList },
          id: props.id,
          collection: PRODUCTS
        })
      }
      if (action === 'edit') {
        console.log('props', data)
        const dataCopy = { ...data }
        const productList = props.productList.filter(product => product.code !== dataCopy.code)
        productList.push({ ...data })
        console.log('projectList', productList)
        setProductList(productList)
        updateData({
          data: { productList },
          id: props.id,
          collection: PRODUCTS
        })
      }
    }
    if (requestType === 'delete') {
      const dataCopy = { ...data }
      const productList = [...props.productList.filter(product => product.code !== dataCopy[0].code)] // dataCopy[0] has zero since the response is an array
      setProductList(productList)
      updateData({
        data: { productList },
        id: props.id,
        collection: PRODUCTS
      })
    }
  }
  return (
    <>
      <div className='control-pane'>
        <div className='control-section'>
          <GridComponent
            id='gridcomp'
            dataSource={productList}
            allowPaging
            allowSorting
            allowExcelExport
            allowPdfExport
            contextMenuItems={contextMenuItems}
            actionBegin={onActionBegin}
            {...props}
          >
            <ColumnsDirective>
              {props.columns.map(data => {
                return (
                  <ColumnDirective
                    key={data.field}
                    {...data}
                  />
                )
              })}
            </ColumnsDirective>
            <Inject services={[Page, Toolbar, Edit, Sort]} />
          </GridComponent>
        </div>
      </div>
    </>
  )
}
export const toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel']
export const editSettings = {
  allowEditing: true,
  allowAdding: true,
  allowDeleting: true,
  newRowPosition: 'Top'
}
export default Table
