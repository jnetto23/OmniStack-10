module.exports = arrayAsString => {
  return arrayAsString.split(",").map(str => str.trim());
};
