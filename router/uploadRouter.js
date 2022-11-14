const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.js");
const fs = require("fs");
const readline = require("readline");
const Part = require("../model/Part.js");
const db = require("../db/db.js");

router.post("/csv", upload.single("file"), async function (req, res) {
  console.log(req.file);
  let extension = getFileExtension(req.file.originalname);
  console.log(extension);
  if (extension == "csv") {
    const input = fs.createReadStream(req.file.path);
    const rl = readline.createInterface({ input });
    let data = [];

    rl.on("line", (row) => {
      data.push(row.split(","));
    });

    rl.on("close", () => {
      console.log("data length: ", data.length);
      let parts = createPartsList(data);
      addPartsToDatabase(parts, res);
    });
  }
});

function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

async function addPartsToDatabase(parts, res) {
  for (let i = 0; i < parts.length; i++) {
    try {
      const result = await db.pool.query(
        "INSERT INTO `parts` (itemNo, vendorNo, barcodeNo, bikeProducer, bikeModel, cc, date_from, date_to, date_on, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          parts[i].itemNo,
          parts[i].vendorNo,
          parts[i].barcodeNo,
          parts[i].bikeProducer,
          parts[i].bikeModel,
          parts[i].cc,
          parts[i].date_from,
          parts[i].date_to,
          parts[i].date_on,
          parts[i].country,
        ]
      );
      console.log("new part created");
    } catch (error) {
      console.log(error);
    }
  }
  res.status(200).send({
    message: "Parts added to database",
  });
}

function createPartsList(data) {
  let parts = [];
  for (let i = 1; i < data.length; i++) {
    let part = new Part(
      data[i][0],
      data[i][1],
      data[i][2],
      data[i][3],
      data[i][4],
      data[i][5],
      data[i][6],
      data[i][7],
      data[i][8]
    );
    parts.push(part);
  }
  return parts;
}

module.exports = router;
