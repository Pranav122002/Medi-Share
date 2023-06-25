const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const report = mongoose.model("report");
const heartDisease = mongoose.model("heartDisease");
const pneumonia = mongoose.model("pneumonia");
const brainTumor = mongoose.model("brainTumor");
const kidneyStone = mongoose.model("kidneyStone");

router.post("/api/reports", async (req, res) => {
  try {
    const currentDate = new Date();
    const { ...reportData } = req.body;

    reportData.report_creation_date = currentDate;
    let report;
    switch (reportData.report_type) {
      case "heartDisease":
        report = new heartDisease(reportData);
        break;
      case "pneumonia":
        report = new pneumonia(reportData);
        break;
      case "brainTumor":
        report = new brainTumor(reportData);
        break;
      case "kidneyStone":
        report = new kidneyStone(reportData);
        break;
      default:
        return res.status(400).json({ error: "Invalid report type" });
    }
    await report.save();

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get reports based on report_type
router.post("/api/allreports/:user_id", async (req, res) => {
  const report_type = req.body.report_type;
  try {
    const reports = await report
      .find({
        user_id: req.params.user_id,
        report_type: { $eq: report_type },
      })
      .sort({ report_creation_date: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific report by ID
router.get("/api/reports/:id", async (req, res) => {
  try {
    const report = await report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific report by ID
router.put("/api/reports/:id", async (req, res) => {
  try {
    const report = await report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific report by ID
router.delete("/api/reports/:id", async (req, res) => {
  try {
    const report = await Report.findByIdAndRemove(req.params.id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
