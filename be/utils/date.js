function getToday() {
    const offsetMs = 7 * 60 * 60 * 1000;
    return new Date(Date.now() + offsetMs).toISOString().slice(0, 10);
  }

function getDayAfterMonths(start_date, months) {
    const date = new Date(start_date);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
}

  module.exports = { getToday,getDayAfterMonths };