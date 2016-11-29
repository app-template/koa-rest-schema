function setNoEmpty(target, property, value) {
  if(value) {
    target[property] = value;
  }
}

module.exports = {setNoEmpty};