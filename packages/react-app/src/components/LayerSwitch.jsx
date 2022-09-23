import React from "react";
import { Dropdown, Menu, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

function LayerSwitch({ layerOptions, selectedOption, setSelectedOption }) {
  // Hooks
  let history = useHistory();

  const AddButton = ({ type = "text" }) => {
    return (
      <Button type={type} onClick={() => history.push("/polygons")} icon={<PlusCircleOutlined />}>
        <span style={{ textTransform: "capitalize" }}>Add New Zone</span>
      </Button>
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
      <Menu.Item key={9}>
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
