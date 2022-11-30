const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.js");
const fs = require("fs");
const readline = require("readline");
const db = require("../db/db.js");

const { parse } = require("csv-parse");

router.post(
  "/user_csv/:supplierId",
  upload.single("file"),
  async function (req, res) {
    let sId = req.params.supplierId;
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a CSV file!" });
    }
    if (getFileExtension(req.file.originalname) != "csv") {
      return res.status(400).send({ message: "Please upload a CSV file!" });
    }

    const input = fs.createReadStream(req.file.path);
    const rl = readline.createInterface({ input });
    var partsList = [];

    fs.createReadStream(req.file.path)
      .pipe(
        parse({
          delimiter: ",",
          skip_empty_lines: true,
          bom: true,
          columns: true,
        })
      )
      .on("data", (data) => {
        partsList.push(createPartFitment(data, sId));
      })
      .on("error", (err) => {
        console.log(err);
      })
      .on("end", () => {
        populateDatabase(partsList, res);
      });
  }
);

async function deleteFile(path) {
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File deleted successfully");
    }
  });
}

async function populateDatabase(partsList, res) {
  for (let i = 0; i < partsList.length; i++) {
    let fittingId = 0;
    let partId = 0;
    try {
      const checkIfPartExists = await db.pool.query(
        "SELECT * FROM `part` WHERE `sku` = ?",
        [partsList[i].sku]
      );
      if (checkIfPartExists.length == 0) {
        const addNewPart = await db.pool.query(
          "INSERT INTO `part` (sku, part_name, supplier_id) VALUES (?, ?, ?)",
          [partsList[i].sku, partsList[i].partName, partsList[i].supplierId]
        );
        partId = parseInt(addNewPart.insertId);
        try {
          // add alt_skus to part
          const addAltSkus = await db.pool.query(
            "INSERT INTO `alt_skus` (partNo, vendorNo, alt_sku, part_id, part_supplier_id) VALUES (?, ?, ?, ?, ?)",
            [
              partsList[i].alt_partNo,
              partsList[i].alt_vendorNo,
              partsList[i].alt_sku,
              partId,
              partsList[i].supplierId,
            ]
          );
        } catch (err) {
          res.status(500).send({ message: err.message });
        }
      } else {
        partId = parseInt(checkIfPartExists[0].id);
        console.log("Part already exists", partId);
      }
    } catch (error) {
      res.status(500).send({ message: err.message });
    } finally {
      // add part fitment
      try {
        let createFitments = false;
        const checkIfFittingAlreadyExists = await db.pool.query(
          "SELECT * FROM `fitting` WHERE `manufacturer` = ? AND `model` = ? AND `cc` = ? AND `date_from` = ? AND `date_to` = ?",
          [
            partsList[i].fitting.manufacturer,
            partsList[i].fitting.model,
            partsList[i].fitting.cc,
            partsList[i].fitting.date_from,
            partsList[i].fitting.date_to,
          ]
        );
        if (checkIfFittingAlreadyExists.length == 0) {
          createFitments = true;
        } else {
          fittingId = checkIfFittingAlreadyExists[0].id;
          console.log("Fitting already exists", fittingId);
          const checkIfFittingHasPart = await db.pool.query(
            "SELECT * FROM `part_has_fitting` WHERE `fitting_id` = ? AND `part_id` = ? AND `part_supplier_id` = ?",
            [fittingId, partId, partsList[i].supplierId]
          );
          if (checkIfFittingHasPart.length == 0) {
            createFitments = true;
            console.log("fitting has no part join.");
          } else {
            createFitments = false;
            console.log("fitting has part do not create.");
          }
        }

        console.log("create fitments", createFitments);

        if (createFitments) {
          let fId = await createFitting(partsList[i]);
          let sId = parseInt(partsList[i].supplierId);
          console.log("fitting id", fId);
          console.log("part id", partId);
          console.log("supplier id", sId);
          createFittingJoin(fId, partId, sId);
        } else {
          console.log("fitting already exists");
        }
      } catch (error) {
        res.status(500).send({ message: err.message });
      }
    }
  }
  res.status(200).send({ message: "Uploaded the file successfully: " });
}

async function createFitting(data) {
  let fittingId = 0;
  try {
    const addFitting = await db.pool.query(
      "INSERT INTO `fitting` (type, manufacturer, model, cc, date_from, date_to, date_on) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        data.fitting.type,
        data.fitting.manufacturer,
        data.fitting.model,
        data.fitting.cc,
        data.fitting.date_from,
        data.fitting.date_to,
        data.fitting.date_on,
      ]
    );
    fittingId = parseInt(addFitting.insertId);
  } catch (error) {
    res.status(500).send({ message: err.message });
  } finally {
    return fittingId;
  }
}

async function createFittingJoin(fittingId, partId, sId) {
  try {
    const addPartFitting = await db.pool.query(
      "INSERT INTO `part_has_fitting` (part_id, fitting_id, part_supplier_id) VALUES (?, ?, ?)",
      [partId, fittingId, sId]
    );
  } catch (err) {
    throw err;
  }
}

function createPartFitment(data, sId) {
  //console.log(data);
  // Structure part object
  let part = {
    sku: "",
    supplierId: sId,
    partName: "",
    alt_partNo: "",
    alt_vendorNo: "",
    alt_sku: "",
    fitting: {
      type: "",
      manufacturer: "",
      model: "",
      cc: "",
      display_name: "",
      date_from: "",
      date_to: "",
      date_on: "",
    },
  };

  // check through data and assign to part
  for (let key in data) {
    if (key == "sku") {
      part.sku = data[key];
    } else if (key == "part_name") {
      part.partName = data[key];
    } else if (key == "alt_part_no") {
      part.alt_partNo = data[key];
    } else if (key == "alt_vendor_no") {
      part.alt_vendorNo = data[key];
    } else if (key == "alt_sku") {
      part.alt_sku = data[key];
    } else if (key == "type") {
      part.fitting.type = data[key];
    } else if (key == "make") {
      part.fitting.manufacturer = data[key];
    } else if (key == "model") {
      part.fitting.model = data[key];
    } else if (key == "cc") {
      part.fitting.cc = data[key];
    } else if (key == "display_name") {
      part.fitting.display_name = data[key];
    } else if (key == "date_from") {
      part.fitting.date_from = data[key];
    } else if (key == "date_to") {
      part.fitting.date_to = data[key];
    } else if (key == "date_on") {
      part.fitting.date_on = data[key];
    }
  }
  return part;
}

function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

module.exports = router;
