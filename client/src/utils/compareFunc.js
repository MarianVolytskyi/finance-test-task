export function compareData(oldData, newData) {
  if (!oldData || !newData) {
    return null;
  }

  const result = newData.map((item, index) => {
    const oldPrice = oldData[index].price;
    const newPrice = item.price;

    if (newPrice < oldPrice) {
      return "plus";
    } else {
      return "minus";
    }
  });

  return result;
}

export function getChangeClass(change, value) {
  let classes = "";
  if (change === "minus") {
    classes = "has-text-success";
  } else if (change === "plus") {
    classes = "has-text-danger";
  }

  return (
    <td className={classes}>
      {change === "plus" && <span>&#9660;</span>}

      {change === "minus" && <span>&#9650;</span>}
      {value}
    </td>
  );
}
