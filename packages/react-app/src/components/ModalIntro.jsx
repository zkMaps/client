import React, { useState } from "react";
import { Modal, Button, Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

const ModalIntro = props => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <div style={{ position: "absolute", top: 30, left: 30, zIndex: 20 }}>
        <Tooltip title="zkInfo">
          <Button shape="circle" icon={<InfoCircleFilled />} onClick={() => setVisible(true)} />
        </Tooltip>
      </div>

      <Modal
        title="zkWhat? zkMaps!"
        centered
        style={{ padding: 10 }}
        visible={visible}
        // onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={null}
        width="100vw"
        height="100vh"
      >
        <p>some contents...</p>
      </Modal>
    </>
  );
};

export default ModalIntro;
