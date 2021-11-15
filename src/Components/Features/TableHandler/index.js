import { Space } from "antd"
import CustomTable from "Components/Commons/CustomTable"
import MainButton from "Components/Commons/MainButton"
import React, { useEffect, useState } from "react"
import { ReloadOutlined, FilterOutlined } from "@ant-design/icons"
import SchedulersClass from "Services/Classes/SchedulesClass"
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
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint"
import FormHandlerAdd from "../FormHandler/FormHandlerAdd"
function TableHandler(props) {
  const {
    ServiceClass,
    columns,
    data,
    loadData,
    enableAdd,
    enableFilter,
    enableRowSelect,
    isLoading,
    setIsLoading,
    rowSelection,
    enableEdit,
    handleModified,
  } = useTableHandler(props)
  const { sm } = useBreakpoint()
  const { path } = useRouteMatch()
  const history = useHistory()
  const location = useLocation()

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
            loadData={loadData}
          />
          <CustomTable
            columns={[...columns]}
            dataSource={[...data]}
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
          />
        </div>
      )}
      <Switch>
        <Route exact path={path}></Route>
        {enableAdd && (
          <Route exact path={`${path}/add`}>
            <FormHandlerAdd
              ServiceClass={ServiceClass}
              back={() => {
                history.push(path)
              }}
              formType="add"
            />
          </Route>
        )}
        {enableEdit && (
          <Route exact path={`${path}/modified`}>
            <FormHandler
              ServiceClass={ServiceClass}
              back={() => {
                history.push(path)
              }}
              formType="modified"
              formSave={(data) => {
                handleModified(data)
              }}
            />
          </Route>
        )}
        <Route path="*">
          <URLNotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default TableHandler

const ActionButtons = (props) => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const { enableFilter, enableAdd, ServiceClass, loadData, setIsLoading } =
    props

  return (
    <StyledContainer enableFilter={enableFilter}>
      <StyledLeftContent enableFilter={enableFilter}>
        <MainButton type="default" shape="circle" Icon={<FilterOutlined />} />
        <CustomInput placeholder="Search" />
      </StyledLeftContent>
      <StyledRightContent enableAdd={enableAdd}>
        <MainButton
          Icon={<ReloadOutlined />}
          label="Refresh"
          type="default"
          onClick={() => {
            loadData()
            setIsLoading(true)
          }}
        />
        {ServiceClass.COLLECTION_NAME === SchedulersClass.COLLECTION_NAME && (
          <MainButton label="Add Group Payment" type="default" />
        )}
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
