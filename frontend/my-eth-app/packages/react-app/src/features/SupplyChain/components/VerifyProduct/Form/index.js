import React, { useState } from "react";
import Result from "../Result";

const Form = () => {
  const [Res, setRes] = useState(false);
  const [LotID, setLotID] = useState("1");
  const [SKU, setSKU] = useState("1");
  const [Manufacturer, setManufacturer] = useState("1");
  const [ExpirationDate, setExpirationDate] = useState("1");
  const [Key, setKey] = useState(
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  );

  function GetResult(Res, LotID, SKU, Manufacturer, ExpirationDate, Key) {
    if (Res === false) {
    } else {
      return (
        <Result
          LotID={LotID}
          SKU={SKU}
          Manufacturer={Manufacturer}
          ExpirationDate={ExpirationDate}
          Key={Key}
        />
      );
    }
  }

  return (
    <div className="form">
      <div className="field">
        <label className="label">Lot ID</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Lot ID"
            id="LotID"
          />
        </div>
      </div>
      <div className="field">
        <label className="label">SKU</label>
        <div className="control">
          <input className="input" type="text" placeholder="SKU" id="SKU" />
        </div>
      </div>
      <div className="field">
        <label className="label">Manufacturer Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Manufacturer Name"
            id="Manufacturer"
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Expiration Date</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Expiration Date"
            id="Exp"
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Ledger Key</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="0x0000000000000000000000000000000000000000000000000000000000000000"
          />
        </div>
      </div>
      <button
        className="button is-primary is-fullwidth"
        onClick={() => {
          setLotID(document.getElementById("LotID").value);
          setSKU(document.getElementById("SKU").value);
          setManufacturer(document.getElementById("Manufacturer").value);
          setExpirationDate(document.getElementById("Exp").value);
          setRes(true);
        }}
      >
        Verify
      </button>
      {GetResult(Res, LotID, SKU, Manufacturer, ExpirationDate, Key)}
    </div>
  );
};

export default Form;
