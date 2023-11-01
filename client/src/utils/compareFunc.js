export function getChangeClass(data, value, name) {
  const el = data.find((item) => item.ticker === name);

  let classes = "";
  if (el.change === "minus") {
    classes = "has-text-success";
  } else if (el.change === "plus") {
    classes = "has-text-danger";
  }

  return (
    <td className={classes}>
      {el.change === "plus" && <span>&#9660;</span>}

      {el.change === "minus" && <span>&#9650;</span>}
      {value}
    </td>
  );
}

export function compareData(previousData, newData) {
  if (!previousData || !newData) {
    return;
  }
  let result = [];
  for (let i = 0; i < newData.length; i++) {
    for (let j = 0; j < previousData.length; j++) {
      if (newData[i].ticker === previousData[j].ticker) {
        let diff = newData[i].price - previousData[j].price;
        let sign = diff >= 0 ? "minus" : "plus";
        result.push({
          ticker: newData[i].ticker,
          change: sign,
        });
      }
    }
  }
  return result;
}
