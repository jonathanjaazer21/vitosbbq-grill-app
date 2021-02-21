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
const Table = () => {
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
  const toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search']
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    newRowPosition: 'Top'
  }

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
    <div className='control-pane'>
      <div className='control-section'>
        <GridComponent
          id='gridcomp'
          dataSource={tableSlice.dataList}
          allowPaging
          allowSorting
          allowExcelExport
          allowPdfExport
          contextMenuItems={contextMenuItems}
          editSettings={editSettings}
          toolbar={toolbarOptions}
          actionBegin={onActionBegin}
        >
          <ColumnsDirective>
            {tableSlice.headers.map(data => {
              return (
                <ColumnDirective
                  key={data.field}
                  field={data.field}
                  headerText={data.headerText}
                  isPrimaryKey={data?.isPrimaryKey}
                />
              )
            })}
          </ColumnsDirective>
          <Inject services={[Page, Toolbar, Edit]} />
        </GridComponent>
      </div>
    </div>
  )
}

export default Table
