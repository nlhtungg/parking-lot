function getToday() {
    const offsetMs = 7 * 60 * 60 * 1000;
    return new Date(Date.now() + offsetMs).toISOString().slice(0, 10);
  }
  
  module.exports = { getToday };

//console.log(getToday());