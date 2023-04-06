import React, { useState } from "react";
import Result from "../Result";

const Form = () => {
  const [Res, setRes] = useState(false);
  const [OpenModal, setOpenModal] = useState(false);
  const [LotID, setLotID] = useState("1");
  const [SKU, setSKU] = useState("1");
  const [Manufacturer, setManufacturer] = useState("1");
  const [ExpirationDate, setExpirationDate] = useState("1");
  const [Key, setKey] = useState(
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  );

  function GetResult(
    Res,
    LotID,
    SKU,
    Manufacturer,
    ExpirationDate,
    Key,
    setOpenModal
  ) {
    if (Res === false) {
    } else {
      return (
        <Result
          LotID={LotID}
          SKU={SKU}
          Manufacturer={Manufacturer}
          ExpirationDate={ExpirationDate}
          Key={Key}
          setModalOpen={setOpenModal}
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
            id="Key"
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
          if (document.getElementById("Key").value !== "") {
            setKey(document.getElementById("Key").value);
          }
          setRes(true);
          setOpenModal(true);
        }}
      >
        Verify
      </button>
      {OpenModal &&
        GetResult(
          Res,
          LotID,
          SKU,
          Manufacturer,
          ExpirationDate,
          Key,
          setOpenModal
        )}
    </div>
  );
};

export default Form;
