import React from "react";

const createOrderForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label className="label">Address</label>
        <div className="control">
          <input className="input" type="text" name="address" />
        </div>
      </div>
    </form>
  );
};
