import React, { useState } from "react";
import { Dropdown, Menu, Button, message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useSetRecoilState } from "recoil";

// Recoil
import { zonesAtom } from "../recoil/zones.js";

const CreateControls = ({ polygon, selectedNetwork, setLastCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  // Recoil
  const setZones = useSetRecoilState(zonesAtom);

  const publicStr = "public";
  const privateStr = "private";

  const _setPublic = () => {
    setPrivacy(publicStr);
  };

  const _setPrivate = () => {
    setPrivacy(privateStr);
  };

  const _generateZone = async () => {
    try {
      setIsLoading(true);
      const inverted = polygon.map(coord => [coord.lng, coord.lat]);
      const id = uuidv4();
      const newZone = {
        id,
        description: `Zone ${id}`,
        coordinates: [inverted],
        privacy: privacy,
        qVertex: inverted.length,
        network: selectedNetwork,
      };
      setZones(z => [...z, newZone]);
      setLastCreated(newZone);
      setIsLoading(false);
      // TODO: add Share zone
      message.success("Zone created");
    } catch (error) {
      console.log("🚀 ~ file: DrawTools.jsx ~ line 131 ~ const_generateContract= ~ error", error.message);
      setIsLoading(false);
      message.error("Error creating new verification zone");
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key={publicStr}>
        <Button type="text" onClick={_setPublic}>
          <span style={{ textTransform: "capitalize" }}>{publicStr}</span>
        </Button>
      </Menu.Item>
      <Menu.Item key={privateStr}>
        <Button type="text" onClick={_setPrivate}>
          <span style={{ textTransform: "capitalize" }}>{privateStr}</span>
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Button
        key="generatecreateButtonContract"
        style={{ verticalAlign: "center", margin: 8, zIndex: 500 }}
        shape="round"
        size="large"
        onClick={_generateZone}
        type="primary"
        loading={isLoading}
      >
        Create Zonee
      </Button>

      <div
        style={{
          position: "absolute",
          bottom: "15px",
          left: "50%",
          transform: "translate(-50%)",
          zIndex: 999,
        }}
      >
        <Dropdown.Button overlay={menu} trigger={["click"]} type="primary" shape="round">
          <span style={{ textTransform: "capitalize" }}>{privacy}</span>
        </Dropdown.Button>
      </div>
    </>
  );
};

export default CreateControls;
