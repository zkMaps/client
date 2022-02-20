import React, { useState } from "react";
import { Modal, Button, Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

const ModalIntro = props => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <div style={{ position: "absolute", bottom: 30, right: 15, zIndex: 20 }}>
        <Tooltip title="zkHistory">
          <Button shape="circle" icon={<InfoCircleFilled />} onClick={() => setVisible(true)} type="primary" />
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
