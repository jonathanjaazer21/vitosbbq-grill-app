import * as React from 'react'
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  Group,
  PdfExport,
  Edit,
  Inject,
  Search,
  Toolbar
} from '@syncfusion/ej2-react-grids'
import { useSelector } from 'react-redux'
import { selectTableSlice } from './tableSlice'
import { addData, deleteData, updateData } from 'services'
import { BRANCHES } from 'services/collectionNames'
const Table = (props) => {
  const tableSlice = useSelector(selectTableSlice)
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

  const onActionBegin = e => {
    const { requestType, data } = e
    const dataCopy = { ...data }
    delete dataCopy._id
    if (requestType === 'save') {
      updateData({
        data: dataCopy,
        id: data._id,
        collection: BRANCHES
      })
    }
    if (requestType === 'delete') {
      deleteData({
        id: data[0]?._id,
        collection: BRANCHES
      })
    }
  }
  return (
    <>
      <div className='control-pane'>
        <div className='control-section'>
          <GridComponent
            id='gridcomp'
            dataSource={tableSlice.dataList}
            allowPaging
            allowSorting
            allowFiltering
            allowGrouping
            allowExcelExport
            allowPdfExport
            contextMenuItems={contextMenuItems}
            actionBegin={onActionBegin}
            {...props}
          >
            <ColumnsDirective>
              {tableSlice.headers.map(data => {
                return (
                  <ColumnDirective
                    key={data.field}
                    {...data}
                  />
                )
              })}
            </ColumnsDirective>
            <Inject services={[Page, Toolbar, Edit, Sort, Filter, Group, ExcelExport]} />
          </GridComponent>
        </div>
      </div>
    </>
  )
}
export const toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search']
export const editSettings = {
  allowEditing: true,
  allowAdding: true,
  allowDeleting: true,
  newRowPosition: 'Top'
}
export default Table
