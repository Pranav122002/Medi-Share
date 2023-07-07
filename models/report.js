const mongoose = require("mongoose");
const express = require("express");

const reportSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  report_type: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  report_creation_date: {
    type: Date,
    required: true,
  },
});

const kidneyStoneSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true,
  },
});

const pneumoniaSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true,
  },
});

const brainTumorSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true,
  },
});

const heartDiseaseSchema = new mongoose.Schema({
  age: {
    type: String,
  },
  sex: {
    type: String,
  },
  cp: {
    type: String,
  },
  trestbps: {
    type: String,
  },
  chol: {
    type: String,
  },
  fbs: {
    type: String,
  },
  restecg: {
    type: String,
  },
  thalach: {
    type: String,
  },
  exang: {
    type: String,
  },
  oldpeak: {
    type: String,
  },
});

const report = mongoose.model("report", reportSchema);
const kidneyStone = report.discriminator("kidneyStone", kidneyStoneSchema);
const pneumonia = report.discriminator("pneumonia", pneumoniaSchema);
const heartDisease = report.discriminator("heartDisease", heartDiseaseSchema);
const brainTumor = report.discriminator("brainTumor", brainTumorSchema);
module.exports = { report, kidneyStone, pneumonia, heartDisease, brainTumor };
