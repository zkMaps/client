import React from "react";
import { Dropdown, Menu, Button } from "antd";
import { ConfigProvider } from "antd";

function NetworkSwitch({ networkOptions, selectedNetwork, setSelectedNetwork }) {
  const menu = (
    <Menu>
      {networkOptions
        .filter(i => i !== selectedNetwork)
        .map(i => (
          <Menu.Item key={i}>
            <Button type="text" onClick={() => setSelectedNetwork(i)}>
              <span style={{ textTransform: "capitalize" }}>{i}</span>
            </Button>
          </Menu.Item>
        ))}
    </Menu>
  );

  ConfigProvider.config({
    theme: {
      primaryColor: selectedNetwork === "mumbai" ? "#5F5CFF" : "#1890ff",
    },
  });

  return (
    <div>
      <Dropdown.Button
        overlay={menu}
        placement="bottomRight"
        trigger={["click"]}
        // type={selectedNetwork === "mumbai" ? "primary" : "seconday"}
        // color={selectedNetwork === "mumbai" ? "#5F5CFF" : "#1890ff"}
        type="primary"
        shape="round"
      >
        <span style={{ textTransform: "capitalize" }}>{selectedNetwork}</span>
      </Dropdown.Button>
    </div>
  );
}

export default NetworkSwitch;
