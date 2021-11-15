import DashboardTransaction from "Components/Features/DashboardTransaction"
import { Link, Route, Switch } from "react-router-dom"
import { useHistory, useRouteMatch, useParams } from "react-router"
import React, { useEffect, useState } from "react"
import useGetDocumentById from "Hooks/useGetDocumentById"
import SchedulersClass from "Services/Classes/SchedulesClass"
import URLNotFound from "Error/URLNotFound"
import MainButton from "Components/Commons/MainButton"
import { Space, Tabs } from "antd"
import CustomInput from "Components/Commons/CustomInput"
import CustomTitle from "Components/Commons/CustomTitle"
import useGetDocuments from "Hooks/useGetDocuments"
const { TabPane } = Tabs

function DashboardTransactionPage() {
  const { path } = useRouteMatch()
  const history = useHistory()
  const [dataSelected, setDataSelected] = useState()
  const [modifiedData, setModifiedData] = useState({})
  return (
    <div style={{ position: "relative" }}>
      <DashboardTransaction
        exposeData={(data) => setDataSelected(data)}
        modifiedData={modifiedData}
      />
      <Switch>
        <Route path={`${path}/:id`}>
          <FormRender
            dataSelected={dataSelected}
            onEditSave={(data) => {
              setModifiedData(data)
              history.push(path)
            }}
          />
        </Route>
      </Switch>
    </div>
  )
}

const FormRender = ({ dataSelected = {}, onEditSave = () => {} }) => {
  const { id } = useParams()
  const [data] = useGetDocumentById(SchedulersClass, id)
  const [value, setValue] = useState({ source: "BDA WE FIND A" })
  const [activeKey, setActiveKey] = useState(1)

  return Object.keys(data).length > 0 ? (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#eee",
        height: "100%",
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Tabs
        value={activeKey}
        onChange={(key) => {
          setActiveKey(key)
        }}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TabPane tab="Direct" key="1">
          <Space direction="vertical" align="start">
            <CustomInput />
            <CustomInput />
            <Space>
              <MainButton
                label="Cancel"
                danger
                onClick={() => {
                  onEditSave({})
                }}
              />
              <MainButton
                label="Save"
                onClick={() => {
                  onEditSave({ ...dataSelected, ...value })
                }}
              />
            </Space>
          </Space>
        </TabPane>
        <TabPane tab="Partner Merchant" key="2">
          <Space direction="vertical">
            <CustomTitle
              label="Source"
              typographyType="text"
              type="secondary"
            />
            <CustomInput />
            <CustomTitle label="Note" typographyType="text" type="secondary" />
            <CustomInput />
            <MainButton
              label="Save"
              onClick={() => {
                onEditSave({ ...data, ...value })
              }}
            />
          </Space>
        </TabPane>
        <TabPane tab="Website" key="3">
          <Space direction="vertical">
            <CustomInput />
            <CustomInput />
            <MainButton
              label="Save"
              onClick={() => {
                onEditSave({ ...dataSelected, ...value })
              }}
            />
          </Space>
        </TabPane>
      </Tabs>
    </div>
  ) : (
    <URLNotFound />
  )
}
export default DashboardTransactionPage
