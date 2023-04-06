import React from "react";
import useVerifyProduct from "../../../hooks/useVerifyProduct";

const Result = ({ LotID, SKU, Manufacturer, ExpirationDate, Key }) => {
  const value = useVerifyProduct(LotID, SKU, Manufacturer, ExpirationDate, Key);
  if (value === undefined) {
    return (
      
      <div className="notification">
        <div className="has-text-centered">loading...</div>
      </div>
    );
  } else {
    return (
      <div className="notification is-link">
        <div className="has-text-centered">{value.toString()}</div>
      </div>
    );
  }
};

export default Result;
