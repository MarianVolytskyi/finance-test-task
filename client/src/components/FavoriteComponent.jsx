import React from "react";
import { getChangeClass } from "../utils/compareFunc";

const FavoritesComponent = ({ favorites, tickerData, prevTickerData, deff, removeFromFavorites }) => {
  return (
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
  );
};

export default FavoritesComponent;
