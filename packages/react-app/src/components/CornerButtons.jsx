import { Button, Tooltip } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import { ClockCircleFilled, BackwardFilled } from "@ant-design/icons";

export default function CornerButtons() {
  const isHome = window.location.pathname === "/";

  // Hooks
  let history = useHistory();

  return (
    <>
      <div style={{ position: "absolute", bottom: 30, right: 15, zIndex: 20 }}>
        <Tooltip title={isHome ? "zkHistory" : "Home"}>
          <Button
            shape="circle"
            icon={isHome ? <ClockCircleFilled /> : <BackwardFilled />}
            onClick={() => (isHome ? history.push("/history") : history.push("/"))}
            type="primary"
          />
        </Tooltip>
      </div>
    </>
  );
}
