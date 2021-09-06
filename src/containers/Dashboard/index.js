import React, { useEffect, useState } from "react"
import ScheduleComponent from "components/SchedulerComponent"
import AppBar from "components/appBar"
import { Wrapper, Container, RightContent } from "../styles"
import Sidenav from "components/sideNav"
import Animate, { FadeIn } from "animate-css-styled-components"
import {
  GRILL_RESERVATION,
  DASHBOARD,
} from "components/sideNav/2.menu/menuData"
import { useDispatch } from "react-redux"
import { navigateTo } from "components/sideNav/sideNavSlice"
import Backdrop from "components/backdrop"
import {
  ToggleBody,
  ToggleButton,
  ToggleContainer,
} from "Restructured/Styles/toggleableContainer"
import { Flex, Grid } from "Restructured/Styles"
import { FilteringPanel } from "Restructured/Components/Features"
import { Button } from "antd"
import ScheduleServices from "Restructured/Services/SchedulerServices"
import ProductServices from "Restructured/Services/ProductServices"
import DropdownServices from "Restructured/Services/DropdownServices"
import datas from "./datas"
import { Progress } from "@ant-design/charts"
import { addData } from "services"
import {
  DATE_END,
  DATE_ORDER_PLACED,
  DATE_START,
} from "Restructured/Constants/schedules"
import { DATE_PAYMENT } from "components/PaymentDetails/types"
import { formatDateFromDatabase } from "Restructured/Utilities/dateFormat"
const dataProduced = datas()
function Dashboard() {
  const dispatch = useDispatch()
  const [isToggled, setIsToggled] = useState(true)
  const [toggle, setToggle] = useState(true)
  const [loading, setLoading] = useState(false)
  const [percent, setPercent] = useState(100)
  const [success, setSuccess] = useState(0)
  const [errorList, setErrorList] = useState([])

  useEffect(() => {
    dispatch(navigateTo([DASHBOARD]))
  }, [])

  const handleScheduler = async () => {
    const data = await DropdownServices.getDropdownList()
    console.log("data", JSON.stringify(data))
  }

  const handleImport = async () => {
    const renewedData = []
    let count = 1
    let error = []
    for (const obj of dataProduced.schedules) {
      const startD = formatDateFromDatabase(obj[DATE_START])
      const endD = formatDateFromDatabase(obj[DATE_END])
      const ordD = formatDateFromDatabase(obj[DATE_ORDER_PLACED])
      const datePaid =
        typeof obj[DATE_PAYMENT] === "undefined"
          ? null
          : formatDateFromDatabase(obj[DATE_ORDER_PLACED])
      // renewedData.push({
      //   ...obj,
      //   [DATE_END]: startD,
      //   [DATE_START]: endD,
      //   [DATE_ORDER_PLACED]: ordD,
      //   [DATE_PAYMENT]: datePaid,
      // })

      const renewedObj = {
        ...obj,
        [DATE_END]: startD,
        [DATE_START]: endD,
        [DATE_ORDER_PLACED]: ordD,
        [DATE_PAYMENT]: datePaid,
      }
      if (!renewedObj[DATE_PAYMENT]) {
        delete renewedObj[DATE_PAYMENT]
      }
      const result = await addData({
        data: { ...renewedObj },
        collection: "schedules",
      })

      if (result) {
        setSuccess(count)
        calculatePercent(count)
        count = count + 1
      } else {
        count = count + 1
        error.push({ ...obj })
      }
    }
    setErrorList(error)
    console.log("error List", error)
  }

  const calculatePercent = (count) => {
    const data = (count / 267) * 100
    setPercent(data.toFixed(0))
  }

  // console.log("success", success)
  // console.log("errors", errorList)
  // console.log("percent", percent)
  return (
    <Wrapper>
      {loading && <Backdrop />}
      <Container>
        <Sidenav
          isToggled={toggle}
          navigateTo={[DASHBOARD, GRILL_RESERVATION]}
        />
        <RightContent isToggled={toggle}>
          <Animate Animation={[FadeIn]} duration={["1s"]} delay={["0.2s"]}>
            <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />
            <Grid height="90vh" alignItems="center">
              <Flex justifyContent="center">
                {/* <Button onClick={handleScheduler}>Exclude</Button>
                <Button onClick={handleImport}>Import</Button> */}
                <p style={{ fontSize: "2rem" }}>Welcome to Vitos BBQ</p>
              </Flex>
              {/* <div>
                <span>{dataProduced.schedules.length}</span>{" "}
                <div style={{ height: "10px", width: "500px" }}>
                  <Progress percent={percent} />
                </div>
                <br />
                <span>{dataProduced.dropdowns.length}</span>
                <br />
                <span>{dataProduced.products.length}</span>
                <br />
              </div> */}
            </Grid>
          </Animate>
        </RightContent>
      </Container>
    </Wrapper>
  )
}

export default Dashboard
