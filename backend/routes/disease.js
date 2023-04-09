



const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

router.post('/disease-predict', (req, res) => {
  // get input data from request body
  const inputData = req.body;

  // spawn child process to run python script
  const pythonProcess = spawn('python', ['C:/Users/prana/Desktop/asdf/Medi-Share/backend/pred.py']);

  // pass input data to python script
  pythonProcess.stdin.write(JSON.stringify(inputData));

  // handle stdout from python script
  pythonProcess.stdout.on('data', (data) => {
    const predictionResult = data.toString().trim();
    console.log("data = ", data);
    
    res.json({ result: predictionResult });
  });

  // handle errors from python script
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
    res.status(500).json({ error: 'An error occurred while making the prediction.' });
  });

  // close stdin and end the process
  pythonProcess.stdin.end();
});

module.exports = router;


