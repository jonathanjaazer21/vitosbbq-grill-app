import React, { useEffect, useState } from "react"
import { Card, Col, Row } from "antd"
import { useSelectMenus } from "../Sidenav/hook"
import { DASHBOARD, LABEL } from "Constants/pathNames"
import { useHistory } from "react-router-dom"
const { Meta } = Card

const iconSize = {
  fontSize: "15rem",
  color: "#888",
}

function Dashboard({ mainMenu = DASHBOARD }) {
  const history = useHistory()
  const { menus } = useSelectMenus()
  const [menuToView, setMenuToView] = useState([])
  useEffect(() => {
    if (menus.length !== 0) {
      const { subMenu = [] } = menus.find(({ key }) => key === mainMenu)
      const _menuToView = subMenu.filter(({ display }) => display)
      setMenuToView(_menuToView)
    }
  }, [menus])
  // return (
  //   <div>
  //     <DashboardOutlined style={iconSize} />
  //   </div>
  // )

  return (
    <Row
      gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      {menuToView.map(({ key, imageUrl, path }) => {
        return (
          <Col key={key}>
            <Card
              onClick={() => history.push(path)}
              hoverable
              cover={
                <div
                  style={{
                    maxHeight: "200px",
                    overflow: "hidden",
                    minHeight: "200px",
                  }}
                >
                  <img src={imageUrl} width={300} />
                </div>
              }
              style={{ width: 300 }}
            >
              <Meta title={LABEL[key]} />
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default Dashboard
