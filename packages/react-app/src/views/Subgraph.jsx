import "antd/dist/antd.css";
import "graphiql/graphiql.min.css";

import React, { useState } from "react";
import { Button, Input, Table, Typography } from "antd";
import { gql, useQuery } from "@apollo/client";
import GraphiQL from "graphiql";
import fetch from "isomorphic-fetch";

import { Address } from "../components";

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
    logVerifieds(where:{userAddress: "0x36e5DE22e6dbe66893cD38f0f4782548a0B9B410" }) {
      id
      userAddress
      timestamp
    }
  }
  `;
  const VERIFIED_GQL = gql(VERIFY_USER);
  const { loading, data } = useQuery(VERIFIED_GQL, { pollInterval: 2500 });

  // const purposeColumns = [
  //   {
  //     title: "Purpose",
  //     dataIndex: "purpose",
  //     key: "purpose",
  //   },
  //   {
  //     title: "Sender",
  //     key: "id",
  //     render: record => <Address value={record.sender.id} ensProvider={props.mainnetProvider} fontSize={16} />,
  //   },
  //   {
  //     title: "createdAt",
  //     key: "createdAt",
  //     dataIndex: "createdAt",
  //     render: d => new Date(d * 1000).toISOString(),
  //   },
  // ];

  // const [newPurpose, setNewPurpose] = useState("loading...");

  if (loading) return <div>loading</div>;
  if (data) console.log("🌍 [subrapgh]: ", data);
  return (
    <>
      <div style={{ width: 780, margin: "auto", paddingBottom: 64 }}>
        {/* <div style={{ margin: 32, textAlign: "right" }}>
          <Input
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
          />
        </div> */}

        {data ? <div>{JSON.stringify(data)}</div> : <div>no data</div>}
      </div>

      <div style={{ padding: 64 }}>...</div>
    </>
  );
}

export default Subgraph;
