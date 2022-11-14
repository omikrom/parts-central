const express = require("express");
const router = express.Router();

const db = require("../db/db.js");

router.get("/show", async (req, res) => {
  console.log("create");
});

router.get("/csv/upload", async (req, res) => {
  console.log("csv");
});

router.post("/create_new", async (req, res) => {
  let task = req.body;
  let itemNo = task.itemNo;
  let vendorNo = task.vendorNo;
  let barcodeNo = task.barcodeNo;
  let bikeProducer = task.bikeProducer;
  let bikeModel = task.bikeModel;
  let cc = getCCfromModel(bikeModel);
  let date_from = task.date_from;
  let date_to = task.date_to;
  let date_on = task.date_on;
  let country = task.country;
  console.log(req.body);
  if (task.date_on == undefined) {
    date_on = 0;
  }

  function getCCfromModel(model) {
    let string = model;
    let c = `0123456789`;
    let cc = ``;
    for (let i = 0; i < string.length; i++) {
      if (c.includes(string[i])) {
        cc += string[i];
      }
    }
    return cc;
  }

  let newPart = {
    itemNo: itemNo,
    vendorNo: vendorNo,
    barcodeNo: barcodeNo,
    bikeProducer: bikeProducer,
    bikeModel: bikeModel,
    cc: cc,
    date_from: date_from,
    date_to: date_to,
    date_on: date_on,
    country: country,
  };

  try {
    const result = await db.pool.query(
      "INSERT INTO `parts` (itemNo, vendorNo, barcodeNo, bikeProducer, bikeModel, cc, date_from, date_to, date_on, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        itemNo,
        vendorNo,
        barcodeNo,
        bikeProducer,
        bikeModel,
        cc,
        date_from,
        date_to,
        date_on,
        country,
      ]
    );
    console.log("new part created");
    res
      .status(200)
      .send({
        message: "Part created successfully",
        part: newPart,
      })
      .end();
  } catch (err) {
    throw err;
  }
});

router.get("/show_all", async (req, res) => {
  let responseBody = [];
  try {
    const result = await db.pool.query("SELECT * FROM `parts` ");
    result.forEach((element) => {
      responseBody.push(element);
    });
    console.log(responseBody);
    res.status(200).send(responseBody);
  } catch (err) {
    throw err;
  }
});

router.post("/update", async (req, res) => {
  try {
    const result = await db.pool.query("UPDATE `parts` SET );
  }
});

module.exports = router;
