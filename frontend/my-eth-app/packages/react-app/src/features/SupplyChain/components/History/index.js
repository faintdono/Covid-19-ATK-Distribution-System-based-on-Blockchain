import React, { useState } from "react";
import useGetLedger from "../../hooks/useGetLedger";

const History = () => {
  const [Key, setKey] = useState(
    "0xffd61d75fdd4aeb0d38caa201f8dd0592fa2fbbb73d54d0adf230c59a255ec39"
  );
  const [listAddress, setListAddress] = useState([]);
  const [Breaking, setBreaking] = useState(true);

  const Ledger = useGetLedger(Key);

  let exKey = Key;
  if (Ledger === undefined) {
    return <div>loading...</div>;
  } else if (
    exKey ===
      "0x0000000000000000000000000000000000000000000000000000000000000000" &&
    Breaking === true
  ) {
    setListAddress([...listAddress, Ledger[0]]);
    setKey(Ledger[5]);
    setBreaking(false);
  } else if (
    exKey !==
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  ) {
    setListAddress([...listAddress, Ledger[0]]);
    exKey = Ledger[5];
    setKey(Ledger[5]);
  }
  console.log(listAddress);
  console.log(exKey);
  return (
    <button className="button">
      <i class="fa fa-history" aria-hidden="true"></i>
    </button>
  );
};

export default History;
