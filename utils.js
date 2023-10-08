export const fixedLengthText = (text, length) => {
    if (text) {
      if (text.length > length) {
        return text.slice(0, length) + "...";
      } else return text;
    } else return "N/A";
  };
  
  export const currencyFormatter = (number) => {
    return number === "None" ? 0.0 : Number.parseFloat(number).toFixed(2);
  };