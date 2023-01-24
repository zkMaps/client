import React from "react";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { HomeFilled } from "@ant-design/icons";

function Dune() {
  // you can also use hooks locally in your component of choice

  // Hooks
  let history = useHistory();

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          alignItems: "center",
          marginTop: 70,
          padding: 10,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <iframe
          src="https://dune.com/embeds/1266843/2170428/24664aba-b484-4ea1-be06-c5a4d1a99993"
          height="500"
          width="100%"
          title="Verification by Location"
        ></iframe>
        <iframe
          src="https://dune.com/embeds/1266821/2170382/e82fafc5-8f57-4ed9-89b1-14632e12aac7"
          height="500"
          width="100%"
          title="Verified Addresses for Public Zones"
        ></iframe>
      </div>
      <div style={{ position: "absolute", top: 15, left: 11, zIndex: 200 }}>
        <Button shape="circle" icon={<HomeFilled />} onClick={() => history.push("/")} type="primary" />
      </div>
    </div>
  );
}

export default Dune;
