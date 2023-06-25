const cron = require("node-cron");
const discardExpiredMedicines = require("./discardExpiredMeds");
const resetMedicineRequestLimit = require("./resetMedicineRequestLimit")

// Cron schedule to reset medicine_request_limit
// Runs every month
cron.schedule('0 0 * * *', resetMedicineRequestLimit);

// Cron schedule to discard expired medicines
// Runs every midnight
cron.schedule('0 0 * * *', discardExpiredMedicines);


// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });