import DashboardTransaction from "Components/Features/DashboardTransaction"
import { Link, Route, Switch } from "react-router-dom"
import { useHistory, useRouteMatch, useParams } from "react-router"
import React, { useContext, useEffect, useState } from "react"
import useGetDocumentById from "Hooks/useGetDocumentById"
import SchedulersClass from "Services/Classes/SchedulesClass"
import URLNotFound from "Error/URLNotFound"
import MainButton from "Components/Commons/MainButton"
import { Space, Tabs } from "antd"
import CustomInput from "Components/Commons/CustomInput"
import CustomTitle from "Components/Commons/CustomTitle"
import useGetDocuments from "Hooks/useGetDocuments"
import OrderForm, {
  StyledContainer,
} from "Components/Features/DashboardTransaction/OrderForm"
import useQuery from "Hooks/useQuery"
import { UnauthorizedContext } from "Error/Unauthorized"
const { TabPane } = Tabs

function DashboardTransactionPage() {
  const { user } = useContext(UnauthorizedContext)
  const { path } = useRouteMatch()
  const history = useHistory()
  const [dataLoaded, setDataLoaded] = useState(null)
  const [modifiedData, setModifiedData] = useState({})
  const [advancefilterButton, setAdvanceFilterButton] = useState("flex")
  return (
    <div style={{ position: "relative" }}>
      <DashboardTransaction
        // exposeData={(data) => setDataLoaded(data)}
        modifiedData={modifiedData}
        advanceButtonDisplay={advancefilterButton}
      />
      <Switch>
        <Route exact path={path}></Route>
        <Route exact path={`${path}/add`}>
          <OrderForm
            back={() => {
              history.push(path)
              setAdvanceFilterButton("flex")
            }}
            formType="add"
            setAdvanceFilterButton={setAdvanceFilterButton}
            modifiedData={(data) => setModifiedData(data)}
          />
        </Route>
        <Route exact path={`${path}/modified`}>
          <OrderForm
            back={() => {
              history.push(path)
              setAdvanceFilterButton("flex")
            }}
            formType="modified"
            setAdvanceFilterButton={setAdvanceFilterButton}
            modifiedData={(data) => setModifiedData(data)}
          />
        </Route>
        <Route path="*">
          <StyledContainer>
            <URLNotFound />
          </StyledContainer>
        </Route>
      </Switch>
    </div>
  )
}

export default DashboardTransactionPage
