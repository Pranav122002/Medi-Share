const cron = require('node-cron');
const discardExpiredMedicines = require('./discardExpiredMeds');

cron.schedule('0 0 * * *', () => {
  // Run the script every day at midnight (0:00)
  
  discardExpiredMedicines();
});
