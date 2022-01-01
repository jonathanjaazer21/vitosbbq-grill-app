import { Space } from "antd"
import CustomTable from "Components/Commons/CustomTable"
import MainButton from "Components/Commons/MainButton"
import React, { useContext, useEffect, useState } from "react"
import {
  ReloadOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons"
import styled from "styled-components"
import CustomInput from "Components/Commons/CustomInput"
import useTableHandler from "./hook"
import classes from "./table.module.css"
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router"
import URLNotFound from "Error/URLNotFound"
import FormHandler from "../FormHandler"
import FormHandlerAdd from "../FormHandler/FormHandlerAdd"
import { UnauthorizedContext } from "Error/Unauthorized"
import FilterOptions from "../FilterOptions"
import CustomTitle from "Components/Commons/CustomTitle"
import { DATE_TYPE, STRING_TYPE } from "Constants/types"
import CustomRangePicker from "Components/Commons/RangePicker"
import useRangeHandler from "Hooks/useRangeHandler"
import useGetDocumentsByKeyword from "Hooks/useGetDocumentsByKeyword"
import DropdownChannel from "./DropdownChannel"
import AutoSelect from "Components/Commons/AutoSelect"
function TableHandler(props) {
  const {
    ServiceClass,
    columns,
    hideColumns,
    data,
    loadData,
    enableAdd,
    defaultAddForm, // this is true or false
    enableFilter,
    enableRowSelect,
    isLoading,
    setIsLoading,
    rowSelection,
    enableEdit,
    handleModified,
    paginateRequest,
  } = useTableHandler(props)

  const { path } = useRouteMatch()
  const history = useHistory()
  const location = useLocation()
  const [isFiltered, setIsFiltered] = useState(false)
  const [filteredData, setFilteredData] = useState([])

  return (
    <div style={{ position: "relative" }}>
      {data.length > 0 && isLoading === false && (
        <div
          style={
            location.pathname === path
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
        >
          <ActionButtons
            enableFilter={enableFilter}
            enableAdd={enableAdd}
            ServiceClass={ServiceClass}
            setIsLoading={setIsLoading}
            isFiltered={isFiltered}
            setIsFiltered={setIsFiltered}
            loadData={loadData}
            hideColumns={hideColumns}
            setFilteredData={setFilteredData}
          />
          <CustomTable
            isFiltered={isFiltered}
            columns={[...columns]}
            dataSource={isFiltered ? [...filteredData] : [...data]}
            size="small"
            scroll={{ x: "calc(375px + 50%)", y: "90vh" }}
            rowClassName={() => {
              return classes["DEFAULT"]
            }}
            onRow={(record) => {
              return enableRowSelect
                ? {
                    onClick: () => {
                      rowSelection(record) // this is for row clicked used by Dashboard Transactions
                    },
                  }
                : {}
            }}
            pagination={{ pageSize: 15, showSizeChanger: false }}
            loadData={paginateRequest ? loadData : () => {}}
            paginateRequest={paginateRequest}
          />
        </div>
      )}
      <Switch>
        <Route exact path={path}></Route>
        {enableAdd && defaultAddForm && (
          <Route exact path={`${path}/add`}>
            <FormHandlerAdd
              ServiceClass={ServiceClass}
              back={() => {
                history.push(path)
              }}
              hideColumns={hideColumns}
            />
          </Route>
        )}
        {enableEdit && defaultAddForm && (
          <Route exact path={`${path}/modified`}>
            <FormHandler
              ServiceClass={ServiceClass}
              back={() => {
                history.push(path)
              }}
              formSave={(data) => {
                handleModified(data)
              }}
              hideColumns={hideColumns}
            />
          </Route>
        )}
        {defaultAddForm && (
          <Route path="*">
            <StyledURLNotFound>
              <URLNotFound />
            </StyledURLNotFound>
          </Route>
        )}
      </Switch>
    </div>
  )
}

export default TableHandler

const ActionButtons = (props) => {
  const { user } = useContext(UnauthorizedContext)
  const history = useHistory()
  const { path } = useRouteMatch()
  const {
    enableFilter,
    enableAdd,
    ServiceClass,
    loadData,
    setIsLoading,
    setIsFiltered,
    isFiltered,
    hideColumns,
    setFilteredData,
  } = props
  return (
    <StyledContainer enableFilter={enableFilter} wrap>
      <StyledLeftContent enableFilter={enableFilter}>
        <Space>
          <MainButton
            label=""
            type="default"
            shape="circle"
            Icon={<PrinterOutlined />}
          />
          <MainButton
            label=""
            type="default"
            shape="circle"
            Icon={<FileExcelOutlined />}
          />
        </Space>
      </StyledLeftContent>
      <StyledRightContent enableAdd={enableAdd}>
        <MainButton
          Icon={<ReloadOutlined />}
          label=""
          type="default"
          shape="circle"
          onClick={() => {
            loadData({}, user?.branchSelected, true) // refresh data if true
            setIsLoading(true)
          }}
        />
        <MainButton
          label="Add"
          onClick={() => {
            history.push(`${path}/add`)
          }}
        />
      </StyledRightContent>
    </StyledContainer>
  )
}

const MobileTableView = (props) => {
  return <div>Mobile view</div>
}

const StyledURLNotFound = styled.div`
  display: grid;
  grid-template-rows: 3rem 1fr;
  grid-template-columns: 1fr;
  justify-content: flex-start;
  position: absolute;
  top: 0;
  height: 85vh;
  width: 100%;
  z-index: 1000;
  background-color: #eee;
`

const StyledContainer = styled(Space)`
  display: flex;
  width: 100%;
  padding-bottom: 1rem;
  justify-content: ${(props) =>
    props?.enableFilter ? "space-between" : "flex-end"};
`
const StyledLeftContent = styled(Space)`
  display: ${(props) => (props.enableFilter ? "flex" : "none")};
  justify-content: flex-start;
`
const StyledRightContent = styled(Space)`
  display: ${(props) => (props.enableAdd ? "flex" : "none")};
  justify-content: flex-end;
`
