import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./TickerComponent.css";
import { compareData, getChangeClass } from "../utils/compareFunc";
import axios from "axios";
import FavoritesComponent from "./FavoriteComponent";
import LoaderComponent from "./Loader";

const socket = io("http://localhost:4000");

const TickerComponent = () => {
  const [tickerData, setTickerData] = useState(null);
  const prevTickerData = useRef(null);
  const [favorites, setFavorits] = useState([]);
  const [untrackedTickers, setUntrackedTickers] = useState([]);
  const [newInterval, setNewInterval] = useState(2000);

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

  const handleChangeInterval = () => {
    axios
      .post("http://localhost:4000/change-interval", { newInterval })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div className="container ">
      <h2 className="title mt-5">Table Page</h2>
      <div className="mb-5">
        <div className="select is-link">
          <select
            value={newInterval}
            onChange={(e) => setNewInterval(e.target.value)}
          >
            <option value="2000">2 sec</option>
            <option value="5000">5 sec</option>
            <option value="10000">10 sec</option>
            <option value="20000">20 sec</option>
          </select>
        </div>
        <button
          className="button is-success ml-3"
          onClick={handleChangeInterval}
        >
          Change interval
        </button>
      </div>
      {prevTickerData.current ? (
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
                    <td className="has-text-centered has-text-weight-bold">
                      Untracked
                    </td>
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
                      <td>
                        <div className="loader-td"></div>
                      </td>
                      <td></td>
                      <td></td>
                    </>
                  )}
                  <td>
                    {!favorites.includes(item.ticker) ? (
                      <button
                        className="button is-success"
                        onClick={() => addToFavorites(item.ticker)}
                      >
                        Add
                      </button>
                    ) : (
                      <button disabled className="button is-success">
                        Add
                      </button>
                    )}
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
      ) : (
        <div className="container">
          <LoaderComponent />
        </div>
      )}

      {favorites.length > 0 && (
        <FavoritesComponent
          favorites={favorites}
          tickerData={tickerData}
          prevTickerData={prevTickerData}
          deff={deff}
          removeFromFavorites={removeFromFavorites}
        />
      )}
    </div>
  );
};

export default TickerComponent;
