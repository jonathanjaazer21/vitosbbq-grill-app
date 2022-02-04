import { Modal } from "antd"
import React, { useEffect, useState } from "react"
import MainButton from "./MainButton"

function CustomModal({
  buttonLabel = "",
  handleOk = () => {},
  buttonType = "primary",
  buttonShape = "round",
  buttonSize = "medium",
  ButtonIcon = <></>,
  ...rest
}) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleConfirm = () => {
    handleOk()
    setIsModalVisible(false)
  }
  return (
    <>
      <MainButton
        type={buttonType}
        onClick={showModal}
        label={buttonLabel}
        shape={buttonShape}
        size={buttonSize}
        Icon={ButtonIcon}
      />
      <Modal
        title={rest.title}
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        footer={rest.footer}
      >
        {rest.children}
      </Modal>
    </>
  )
}

export default CustomModal
