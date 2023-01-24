import React from "react";
import { Dropdown, Menu, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

function LayerSwitch({ layerOptions, selectedOption, setSelectedOption }) {
  // Hooks
  let history = useHistory();

  const AddButton = ({ type = "text" }) => {
    return (
      <span style={{ textTransform: "capitalize", fontWeight: "bolder", color: "rgb(135, 208, 104)" }}>
        <PlusCircleOutlined />
        Add New Zone
      </span>
    );
  };

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
      <Menu.Item key={9} onClick={() => history.push("/create")} style={{ textAlign: "center" }}>
        <AddButton />
      </Menu.Item>
    </Menu>
  );

  if (!layerOptions?.length) {
    return <AddButton type="primary" />;
  }

  return (
    <Dropdown.Button overlay={menu} trigger={["click"]} type="primary" shape="round">
      <span style={{ textTransform: "capitalize" }}>{selectedOption?.description}</span>
    </Dropdown.Button>
  );
}

export default LayerSwitch;
