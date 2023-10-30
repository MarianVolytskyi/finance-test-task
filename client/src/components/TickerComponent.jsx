import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./TickerComponent.css";
import { compareData, getChangeClass } from "../utils/compareFunc";

const socket = io("http://localhost:4000");

const TickerComponent = () => {
  const [tickerData, setTickerData] = useState(null);
  const prevTickerData = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("start");
    });

    socket.on("ticker", (data) => {
      console.log("Ticker data received:", data);
      setTickerData(data);
      console.log("Prev data received:", prevTickerData.current);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (JSON.stringify(tickerData) !== JSON.stringify(prevTickerData.current)) {
      prevTickerData.current = tickerData;
    }
  }, [tickerData]);

  const difference = compareData(prevTickerData.current, tickerData);

  return (
    <div className="container ">
      <h2 className="title mt-5">Table Page</h2>
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth custom-table ">
        <thead>
          <tr>
            <th className="is-1">
              <abbr title="ID">ID</abbr>
            </th>
            <th className="is-5">
              <abbr title="Ticker">Ticker</abbr>
            </th>
            <th className="is-2">
              <abbr title="Price">Price</abbr>
            </th>
            <th className="is-1">
              <abbr title="Change">Change</abbr>
            </th>
            <th className="is-1">
              <abbr title="Change Percent">Change Percent</abbr>
            </th>
            <th className="is-1">
              <abbr title="Dividend">Dividend</abbr>
            </th>
            <th className="is-1">
              <abbr title="Yield">Yield</abbr>
            </th>
            {/* <th className="is-1">
              <abbr title="Remove">Remove</abbr>
            </th> */}
          </tr>
        </thead>
        <tbody>
          {tickerData &&
            tickerData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="has-text-weight-bold">{item.ticker}</td>
                {getChangeClass(difference?.[index], item.price)}
                <td>{item.change}</td>
                <td>{item.change_percent}</td>
                <td>{item.dividend}</td>
                <td>{item.yield}</td>
                {/* <td>
                  <button
                    className="button is-danger"
                    onClick={() => handleRemoveTicker(index)}
                  >
                    Remove
                  </button>
                </td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TickerComponent;
