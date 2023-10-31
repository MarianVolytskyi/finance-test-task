import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./TickerComponent.css";
import { compareData, getChangeClass } from "../utils/compareFunc";

const socket = io("http://localhost:4000");

const TickerComponent = () => {
  const [tickerData, setTickerData] = useState(null);
  const prevTickerData = useRef(null);
  const [favorites, setFavorits] = useState([]);
  const [untrackedTickers, setUntrackedTickers] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("start");
    });

    socket.on("ticker", (data) => {
      setTickerData(data); 
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

  const deff = compareData(prevTickerData.current, tickerData);

  const addToFavorites = (value) => {
    setFavorits([...favorites, value]);
  };
  const removeFromFavorites = (value) => {
    setFavorits(favorites.filter((ticker) => ticker !== value));
  };

  const untrackTicker = (ticker) => {
    setUntrackedTickers([...untrackedTickers, ticker]);
  };
  const trackTicker = (value) => {
    setUntrackedTickers(untrackedTickers.filter((ticker) => ticker !== value));
  };

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
            <th className="is-1">
              <abbr title="Remove">Favorites</abbr>
            </th>
            <th className="is-1">
              <abbr title="Remove">Tracking</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {tickerData &&
            tickerData.map((item, index) => (
              <tr key={item.ticker}>
                <td>{index + 1}</td>
                <td className="has-text-weight-bold">{item.ticker}</td>
                {prevTickerData.current &&
                !untrackedTickers.includes(item.ticker) ? (
                  getChangeClass(deff, item.price, item.ticker)
                ) : (
                  <td>Untracked</td>
                )}
                {!untrackedTickers.includes(item.ticker) ? (
                  <>
                    <td>{item.change}</td>
                    <td>{item.change_percent}</td>
                    <td>{item.dividend}</td>
                    <td>{item.yield}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
                <td>
                  <button
                    className="button is-success"
                    onClick={() => addToFavorites(item.ticker)}
                  >
                    Add
                  </button>
                </td>
                {!untrackedTickers.includes(item.ticker) ? (
                  <td>
                    <button
                      className="button is-info"
                      onClick={() => untrackTicker(item.ticker)}
                    >
                      {"\u{20E0}"}
                    </button>
                  </td>
                ) : (
                  <td>
                    <button
                      className="button is-info"
                      onClick={() => trackTicker(item.ticker)}
                    >
                      {"\u{1F441}"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      {favorites.length > 0 && (
        <div>
          <h2 className="title mt-5">Favorites</h2>
          <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth custom-table">
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
                <th className="is-1">
                  <abbr title="Remove">Favorites</abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {tickerData
                .filter((item) => favorites.includes(item.ticker))
                .map((item, index) => (
                  <tr key={item.ticker}>
                    <td>{index + 1}</td>
                    <td className="has-text-weight-bold">{item.ticker}</td>
                    {prevTickerData.current ? (
                      getChangeClass(deff, item.price, item.ticker)
                    ) : (
                      <td>{item.price}</td>
                    )}
                    <td>{item.change}</td>
                    <td>{item.change_percent}</td>
                    <td>{item.dividend}</td>
                    <td>{item.yield}</td>
                    <td>
                      <button
                        className="button is-danger"
                        onClick={() => removeFromFavorites(item.ticker)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TickerComponent;
