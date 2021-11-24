import { Modal } from "antd"
import React, { useState } from "react"
import MainButton from "./MainButton"

function CustomModal({ buttonLabel = "", handleOk = () => {}, ...rest }) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <MainButton type="primary" onClick={showModal} label={buttonLabel} />
      <Modal
        title={rest.title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={rest.footer}
      >
        {rest.children}
      </Modal>
    </>
  )
}

export default CustomModal
