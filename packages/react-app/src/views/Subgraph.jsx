import "antd/dist/antd.css";
import "graphiql/graphiql.min.css";
import Blockies from "react-blockies";
import VirtualList from "rc-virtual-list";

import React from "react";
import { Typography, List, Spin } from "antd";
import { gql, useQuery } from "@apollo/client";

function Subgraph(props) {
  // function graphQLFetcher(graphQLParams) {
  //   return fetch(props.subgraphUri, {
  //     method: "post",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(graphQLParams),
  //   }).then(response => response.json());
  // }

  const VERIFY_USER = `
  {
    logVerifieds {
      id
      userAddress
      timestamp
      transactionHash
    }
  }
  `;

  const onScroll = e => {
    // if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight) {
    // appendData();
    // }
  };

  const VERIFIED_GQL = gql(VERIFY_USER);
  const { loading, data } = useQuery(VERIFIED_GQL, { pollInterval: 2500 });

  if (data) console.log("🌍 [subrapgh]: ", data);
  return (
    <div className="ipfs-scroll">
      {props?.address && <OwnerSubgraph {...props} />}
      <div style={{ width: 780, margin: "auto", paddingBottom: 64, marginTop: 40 }}>
        <Typography.Title>All check-ins</Typography.Title>

        {loading ? (
          <div>
            {" "}
            <Spin />
          </div>
        ) : data?.logVerifieds ? (
          <List>
            <VirtualList data={data?.logVerifieds} height={"40%"} itemHeight={60} itemKey="email">
              {item => <ListItem item={item} isOwner={false} />}
            </VirtualList>
          </List>
        ) : (
          <div>no data...</div>
        )}
      </div>
    </div>
  );
}
// {/* <div>{JSON.stringify(data)}</div>  */}

export default Subgraph;

const ListItem = ({ item, isOwner = true }) => {
  const transaction = `https://polygonscan.com/tx/${item.transactionHash}`;
  const address = `https://polygonscan.com/address/${item?.userAddress}`;

  return (
    <List.Item style={{ width: "100%", padding: "30" }}>
      {/* <Card title={item?.userAddress} sub>Card content</Card> */}
      <List.Item.Meta
        avatar={
          isOwner ? null : (
            <a href={address}>
              <Blockies seed={item?.userAddress?.toLowerCase()} size={8} scale={2} />
            </a>
          )
        }
        title={<a href={address}>{item?.userAddress}</a>}
        description={
          <div>
            <a href={transaction}>Tx hash {item.transactionHash}</a>
            <br />
            {new Date(item?.timestamp * 1000).toString()}
          </div>
        }
      />
      <div>👍</div>
    </List.Item>
  );
};

const OwnerSubgraph = props => {
  const VERIFY_USER = `
  {
    logVerifieds(where:{userAddress: "${props?.address}" }) {
      id
      userAddress
      timestamp
      transactionHash
    }
  }
  `;

  const VERIFIED_GQL = gql(VERIFY_USER);
  const { loading, data } = useQuery(VERIFIED_GQL, { pollInterval: 2500 });

  // const onScroll = e => {
  //   // if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight) {
  //   // appendData();
  //   // }
  // };

  if (loading)
    return (
      <div>
        {" "}
        <Spin />
      </div>
    );
  if (data) console.log("🌍 [subrapgh]: ", data);
  return (
    <>
      <div style={{ width: 780, margin: "auto", paddingBottom: 64, marginTop: 40 }}>
        <Typography.Title> <span alt="addmissions">🎫</span> All check-ins</Typography.Title>
        {props?.address && (
          <>
            <Typography.Paragraph>{props?.address}</Typography.Paragraph>
            <Blockies seed={props?.address?.toLowerCase()} size={8} scale={2} />
          </>
        )}

        {loading ? (
          <div>
            {" "}
            <Spin />
          </div>
        ) : data?.logVerifieds ? (
          <List>
            <VirtualList data={data?.logVerifieds} height={"40%"}  itemKey="email">
              {item => <ListItem item={item} isOwner={false} />}
            </VirtualList>
          </List>
        ) : (
          <div>no data...</div>
        )}
      </div>

      <div style={{ padding: 64 }}>...</div>
    </>
  );
};
