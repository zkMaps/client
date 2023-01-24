import { Button, Tooltip } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import { ClockCircleFilled, BackwardFilled, HistoryOutlined } from "@ant-design/icons";

export default function CornerButtons() {
  const isHome = window.location.pathname === "/";

  // Hooks
  let history = useHistory();

  return (
    <>
      <div style={{ position: "absolute", top: isHome ? 130 : 30, left: 11, zIndex: 200 }}>
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
