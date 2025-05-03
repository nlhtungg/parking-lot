function getToday() {
  const offsetMs = 7 * 60 * 60 * 1000; // UTC+7 for Vietnam timezone
  return new Date(Date.now() + offsetMs).toISOString().slice(0, 10);
}

function getDayAfterMonths(start_date, months) {
  const date = new Date(start_date);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

function calculateHoursDifference(startDate, endDate) {
  const diffMs = Math.abs(endDate - startDate);
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours;
}

module.exports = { 
  getToday,
  getDayAfterMonths,
  calculateHoursDifference
};