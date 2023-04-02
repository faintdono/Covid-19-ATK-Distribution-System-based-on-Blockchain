import React from "react";

const GenerateOrderID = (orderID) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const nonce = orderID.toString();
  const step = nonce.length / 3;
  let finalString = "OD";
  for (var x = 0; x < 3; x++) {
    var start = step * x;
    var end = start + step;
    var part = nonce.substring(start, end);
    finalString += part;
    if (x === 0) {
      finalString += year;
    } else if (x === 1) {
      finalString += month;
    } else if (x === 2) {
      finalString += day;
    }
  }
  return finalString;
};

export default GenerateOrderID;
