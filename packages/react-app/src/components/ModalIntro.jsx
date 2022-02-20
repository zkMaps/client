import React, { useState } from "react";
import { Modal, Button, Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import { position } from "@chakra-ui/react";

const ModalIntro = props => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div style={{ position: "absolute", bottom: 80, right: 15, zIndex: 20 }}>
        <Tooltip title="zkInfo">
          <Button shape="circle" icon={<InfoCircleFilled />} onClick={() => setVisible(true)} type="primary" />
        </Tooltip>
      </div>

      <Modal
        title="😶🗺️ zkMaps"
        style={{ padding: 10}}
        visible={visible}
        // onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={null}
        width="60vw"
        height="80vh"
      >
        <p>
        <strong>ZKmaps</strong> enables users to prove their location within a bounding area, GEOfencing, without disclosing thier excat location using ZK snarks.
</p>
<p>
In this case validating - (with a contract generated with circom) that the user was in ETHDenver within a specific time range (using theGragh)
</p>
<p>

We are excited about contributing-developing a this Proof-Of-Locatoin-Protocol which can be used for validating for POAPs DAOs for programatic funds dispersion, proving privately a location within a state or a city. Car hailing, location proximity matching, gaming and minting NFTs based on location and many more creative uses and utilities.

moreover we are excited about the development of tools for providing ZKproofs on the client and verifying them using smart contracts. We are thankful, and would love to PR our small addition to the ZKsnark library, and to the scoffold-ETH project, to be able to facilitate these proof generation on the client (and perhaps appropriate react hooks)
</p>
<p>
 <strong> 🚀 Next steps</strong> 
- In our next steps we are excited to incorporate the FOAM protocol and trusted zone to avoid location-spoofing, or perhaps Helium or other solutions.
- host the Dapp on IPFS/Filecoin 
- automated schedule P-O-L-P (proof of location protocol ?) minting with chainlink keeper
</p>  
<p>

And we would love to see this utilized in the next ETHdenver, to programmatically mint NFTs, POAPs and swag eligibility btween the different venues. (accurate to 30ft)
</p>  
<p>

<li>❤️ Thanks very much to all the mentors and Jedis!</li>

<li>🏕️ ZKmaps repos: https://github.com/zkMaps</li>

<li>🖊️ Circuits and contract: https://github.com/zkMaps/zkMaps</li>

<li>🥷 ZKclient https://github.com/zkMaps/client</li>

<li>🗺️ subgraphs: https://github.com/zkMaps/zkmaps-subgraph</li>
        </p>
      </Modal>
    </>
  );
};

export default ModalIntro;
