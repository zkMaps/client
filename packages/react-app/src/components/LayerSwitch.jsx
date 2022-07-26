import React from "react";
import { Dropdown, Menu, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

function LayerSwitch({ layerOptions, selectedOption, setSelectedOption }) {
  // Hooks
  let history = useHistory();

  const menu = (
    <Menu>
      {layerOptions
        .filter(i => i?.id !== selectedOption?.id)
        .map(i => (
          <Menu.Item key={i?.id}>
            <Button type="text" onClick={() => setSelectedOption(i)}>
              <span style={{ textTransform: "capitalize" }}>{i?.description}</span>
            </Button>
          </Menu.Item>
        ))}
      <Menu.Item key={9}>
        <Button type="text" onClick={() => history.push("/polygons")} icon={<PlusCircleOutlined />}>
          <span style={{ textTransform: "capitalize" }}>Add Zone</span>
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown.Button overlay={menu} trigger={["click"]} type="primary" shape="round">
      <span style={{ textTransform: "capitalize" }}>{selectedOption?.description}</span>
    </Dropdown.Button>
  );
}

export default LayerSwitch;
