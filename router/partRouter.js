const express = require("express");
const router = express.Router();

const db = require("../db/db.js");
const { route } = require("./router.js");

router.get("/show", async (req, res) => {
  console.log("create");
});

router.get("/bike_models", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT DISTINCT bikeModel FROM parts");
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.get("/bike_make", async (req, res) => {
  try {
    const result = await db.pool.query(
      "SELECT DISTINCT bikeProducer FROM parts"
    );
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.get("/cc", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT DISTINCT cc FROM parts");
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// find models by make
router.get("/bike_models/:bikeMake", async (req, res) => {
  console.log(req.params.bikeMake);
  try {
    const result = await db.pool.query(
      "SELECT DISTINCT bikeModel FROM parts WHERE bikeProducer = ?",
      [req.params.bikeMake]
    );
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// find cc by make and model
router.get("/cc/:bikeMake/:bikeModel", async (req, res) => {
  try {
    const result = await db.pool.query(
      "SELECT DISTINCT cc FROM parts WHERE bikeMake = ? AND bikeModel = ?",
      [req.params.bikeMake, req.params.bikeModel]
    );
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// find parts by make, model, and cc
router.get("/parts/:bikeMake/:bikeModel/:cc", async (req, res) => {
  try {
    const result = await db.pool.query(
      "SELECT * FROM parts WHERE bikeMake = ? AND bikeModel = ? AND cc = ?",
      [req.params.bikeMake, req.params.bikeModel, req.params.cc]
    );
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// find parts by make, model and cc where date_to and date_from
router.get(
  "/parts/:bikeMake/:bikeModel/:cc/:date_from/:date_to",
  async (req, res) => {
    try {
      const result = await db.pool.query(
        "SELECT * FROM parts WHERE bikeMake = ? AND bikeModel = ? AND cc = ? AND date BETWEEN ? AND ?",
        [
          req.params.bikeMake,
          req.params.bikeModel,
          req.params.cc,
          req.params.date_from,
          req.params.date_to,
        ]
      );
      res.send(result);
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/parts/:bikeMake/:bikeModel/:cc/:date_from/:date_to/:part",
  async (req, res) => {
    try {
      const result = await db.pool.query(
        "SELECT * FROM parts WHERE bikeMake = ? AND bikeModel = ? AND cc = ? AND date BETWEEN ? AND ? AND part = ?",
        [
          req.params.bikeMake,
          req.params.bikeModel,
          req.params.cc,
          req.params.date_from,
          req.params.date_to,
          req.params.part,
        ]
      );
      res.send(result);
    } catch (err) {
      console.log(err);
    }
  }
);

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

router.post("/update", async (req, res) => {});

module.exports = router;
