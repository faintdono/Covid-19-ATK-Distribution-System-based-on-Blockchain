import React, { useRef } from "react";
import useAddUser from "../../../hooks/useAddUser";

const Form = () => {
  const refDuns = useRef(null);
  const refAddress = useRef(null);
  const refName = useRef(null);
  const refEmail = useRef(null);
  const { send: addUser } = useAddUser();
  const Clear = () => {
    refDuns.current.value = "";
    refAddress.current.value = "";
    refName.current.value = "";
    refEmail.current.value = "";
  };
  return (
    <div className="form" id="AddUser-form">
      <div className="field">
        <label className="label">Duns Number/Tax Number</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Duns Number/Tax Number"
            id="DunsOrTax"
            ref={refDuns}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Role</label>
        <div class="control">
          <div className="select is-fullwidth">
            <select id="Role">
              <option value="role">Select a Role</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="distributor">Distributor</option>
              <option value="wholesaler">Wholesaler</option>\
              <option value="retailer">Retailer</option>
            </select>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Address</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="0x0000000000000000000000000000000000000000000000000000000000000000"
            id="address"
            ref={refAddress}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="name"
            id="name"
            ref={refName}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="email"
            id="email"
            ref={refEmail}
          />
        </div>
      </div>
      <button
        className="button is-primary is-fullwidth"
        onClick={() => {
          const dunsOrTax = document.getElementById("DunsOrTax").value;
          const role = document.getElementById("Role").value;
          const address = document.getElementById("address").value;
          const name = document.getElementById("name").value;
          const email = document.getElementById("email").value;

          addUser(dunsOrTax, role, address, name, email);
          Clear();
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Form;
