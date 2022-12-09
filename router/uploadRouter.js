const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.js");
const fs = require("fs");
const readline = require("readline");
const db = require("../db/db.js");
const auth = require("../middleware/auth.js");

const { parse } = require("csv-parse");

const jobList = require("../jobs/job_list.js");

router.post(
  "/user_csv/:supplierId",
  auth,
  upload.single("file"),
  async function (req, res) {
    let sId = req.params.supplierId;
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a CSV file!" });
    }
    if (getFileExtension(req.file.originalname) != "csv") {
      return res.status(400).send({ message: "Please upload a CSV file!" });
    }
    // 
    // create job
    //
    let newJob = {
      jobId: jobList.length + 1,
      supplierId: sId,
      fileName: req.file.originalname,
      status: "pending",
      progress: 0,
      date: new Date(),
    };

    jobList.push(newJob);

    const input = fs.createReadStream(req.file.path);
    //const rl = readline.createInterface({ input });
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
        throw err;
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        console.log("populating database");
        res.status(200).send({
          message: "Uploaded the file successfully:" + req.file.originalname + "CSV will now be processed",
        });
        // update job
        let jobId = newJob.jobId;
        for (let i = 0; i < jobList.length; i++) {
          if (jobList[i].jobId == jobId) {
            jobList[i].status = "processing";
            break;
          }
        }
        populateDatabase(partsList, req.file.path, jobId);
      });
  }
);

async function deleteFile(path) {
  fs.unlink(path, (err) => {
    if (err) {
      throw err;
    } else {
      console.log("File deleted successfully");
    }
  });
}


async function populateDatabase(partsList, path, jobId) {

  let percentage = parseInt(partsList.length / 100);
  let progressLimits = [];
  for (let i = 0; i < 90; i++) {
    progressLimits.push(percentage * i);
  }

  for (let i = 0; i < partsList.length; i++) {

    for (let j = 0; j < progressLimits.length; j++) {
      if (i == progressLimits[j]) {
        let progress = parseInt((i / partsList.length) * 100) + 10;
        for (let k = 0; k < jobList.length; k++) {
          if (jobList[k].jobId == jobId) {
            jobList[k].progress = progress;
            break;
          }
        }
      } else {
        continue;
      }
    }



    let fittingId = 0;
    let partId = 0;

    try {
      const checkIfPartExists = await db.pool.query(
        "SELECT * FROM `part` WHERE sku = ? AND supplier_id = ?",
        [partsList[i].sku, parseInt(partsList[i].supplierId)]
      );
      if (checkIfPartExists.length > 0) {
        // Part exists
        partId = checkIfPartExists[0].id;

        if (partsList[i].partName != checkIfPartExists[0].part_name) {
          // update part name
          const updatePartName = await db.pool.query(
            "UPDATE `part` SET part_name = ? WHERE id = ?",
            [partsList[i].partName, partId]
          );
        }

        if (partsList[i].alt_sku || partsList[i].alt_partNo || partsList[i].alt_vendorNo) {
          // check if alt sku exists
          const checkIfAltSkuExists = await db.pool.query(
            "SELECT id FROM `alt_sku` WHERE part_id = ? AND part_supplier_id = ? AND alt_sku = ?",
            [partId, partsList[i].alt_sku]
          );
          if (checkIfAltSkuExists.length > 0) {
            // Alt sku exists
            if (partsList[i].alt_sku) {
              // update alt sku
              const updateAltSku = await db.pool.query(
                "UPDATE `alt_skus` SET alt_sku = ? WHERE id = ?",
                [partsList[i].alt_sku, checkIfAltSkuExists[0].id]
              );
            }
            if (partsList[i].alt_partNo) {
              // update alt part no
              const updateAltPartNo = await db.pool.query(
                "UPDATE `alt_skus` SET alt_part_no = ? WHERE id = ?",
                [partsList[i].alt_partNo, checkIfAltSkuExists[0].id]
              );
            }
            if (partsList[i].alt_vendorNo) {
              // update alt vendor no
              const updateAltVendorNo = await db.pool.query(
                "UPDATE `alt_skus` SET alt_vendor_no = ? WHERE id = ?",
                [partsList[i].alt_vendorNo, checkIfAltSkuExists[0].id]
              );
            }
          } else {
            // Alt sku does not exist
            const insertAltSku = await db.pool.query(
              "INSERT INTO `alt_skus` (part_id, part_supplier_id, alt_sku, alt_part_no, alt_vendor_no) VALUES (?, ?, ?, ?, ?)",
              [partId, partsList[i].alt_sku, partsList[i].alt_partNo, partsList[i].alt_vendorNo]
            );
          }
        }

        // check if fitting exists
        const checkIfFittingExists = await db.pool.query(
          "SELECT * FROM `fitting` WHERE manufacturer = ? AND model = ? AND cc = ? AND date_from = ? AND date_to = ?",
          [
            partsList[i].fitting.manufacturer,
            partsList[i].fitting.model,
            partsList[i].fitting.cc,
            partsList[i].fitting.date_from,
            partsList[i].fitting.date_to,
          ]
        );
        if (checkIfFittingExists.length > 0) {
          // Fitting exists
          fittingId = checkIfFittingExists[0].id;
          // update fitting
          if (partsList[i].fitting.manufacturer) {
            const updateFittingManufacturer = await db.pool.query(
              "UPDATE `fitting` SET manufacturer = ? WHERE id = ?",
              [partsList[i].fitting.manufacturer, fittingId]
            );
          }
          if (partsList[i].fitting.model) {
            const updateFittingModel = await db.pool.query(
              "UPDATE `fitting` SET model = ? WHERE id = ?",
              [partsList[i].fitting.model, fittingId]
            );
          }
          if (partsList[i].fitting.cc) {
            const updateFittingCc = await db.pool.query(
              "UPDATE `fitting` SET cc = ? WHERE id = ?",
              [partsList[i].fitting.cc, fittingId]
            );
          }
          if (partsList[i].fitting.date_from) {
            const updateFittingDateFrom = await db.pool.query(
              "UPDATE `fitting` SET date_from = ? WHERE id = ?",
              [partsList[i].fitting.date_from, fittingId]
            );
          }
          if (partsList[i].fitting.date_to) {
            const updateFittingDateTo = await db.pool.query(
              "UPDATE `fitting` SET date_to = ? WHERE id = ?",
              [partsList[i].fitting.date_to, fittingId]
            );
          }
          if (partsList[i].fitting.date_to) {
            const updateFittingDateTo = await db.pool.query(
              "UPDATE `fitting` SET date_to = ? WHERE id = ?",
              [partsList[i].fitting.date_to, fittingId]
            );
          }
          if (partsList[i].fitting.display_name) {
            const updateFittingDisplayName = await db.pool.query(
              "UPDATE `fitting` SET display_name = ? WHERE id = ?",
              [partsList[i].fitting.display_name, fittingId]
            );
          }
        } else {
          // Fitting does not exist
          const insertFitting = await db.pool.query(
            "INSERT INTO `fitting` (manufacturer, model, cc, date_from, date_to) VALUES (?, ?, ?, ?, ?)",
            [
              partsList[i].fitting.manufacturer,
              partsList[i].fitting.model,
              partsList[i].fitting.cc,
              partsList[i].fitting.date_from,
              partsList[i].fitting.date_to,
            ]
          );
          fittingId = insertFitting.insertId;
          // Create fitting join
          const insertFittingJoin = await db.pool.query(
            "INSERT INTO `part_has_fitting` (part_id, fitting_id, part_supplier_id) VALUES (?, ?, ?)",
            [partId, fittingId, parseInt(partsList[i].supplierId)]
          );
        }
      } else {
        // Part does not exist
        const addPart = await db.pool.query(
          "INSERT INTO `part` (sku, part_name, supplier_id) VALUES (?, ?, ?)",
          [
            partsList[i].sku,
            partsList[i].partName,
            parseInt(partsList[i].supplierId),
          ]
        );
        partId = parseInt(addPart.insertId);
        const addAltSku = await db.pool.query(
          "INSERT INTO `alt_skus` (part_id, part_supplier_id) VALUES (?, ?)",
          [partId, parseInt(partsList[i].supplierId)]
        );
        // add fitting
        const addFitting = await db.pool.query(
          "INSERT INTO `fitting` (manufacturer, model, cc, date_from, date_to) VALUES (?, ?, ?, ?, ?)",
          [
            partsList[i].fitting.manufacturer,
            partsList[i].fitting.model,
            partsList[i].fitting.cc,
            partsList[i].fitting.date_from,
            partsList[i].fitting.date_to,
          ]
        );
        fittingId = parseInt(addFitting.insertId);
        // Create fitting join
        const insertFittingJoin = await db.pool.query(
          "INSERT INTO `part_has_fitting` (part_id, fitting_id, part_supplier_id) VALUES (?, ?, ?)",
          [partId, fittingId, parseInt(partsList[i].supplierId)]
        );
      }
    } catch (err) {
      throw err;
    }
  }
  // job complete
  for (let i = 0; i < jobList.length; i++) {
    if (jobList[i].jobId == jobId) {
      jobList[i].progress = 100;
      jobList[i].status = "complete";
      break;
    }
  }
  deleteJob(jobId);
  deleteFile(path);
}

async function deleteJob(jobId) {
  // wait 1 hour before deleting job
  setTimeout(async () => {
    for (let i = 0; i < jobList.length; i++) {
      if (jobList[i].jobId == jobId) {
        jobList.splice(i, 1);
        break;
      }
    }
  }, 3600000);
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
        data.fitting.display_name,
        data.fitting.cc,
        data.fitting.date_from,
        data.fitting.date_to,
        data.fitting.date_on,
      ]
    );
    fittingId = parseInt(addFitting.insertId);
  } catch (error) {
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

    switch (key) {
      //---------------------//
      //------ part cases----//
      //---------------------//

      //-- sku cases
      case "sku":
        part.sku = data[key];
        break;
      case "SKU":
        part.sku = data[key];
        break;
      case "Sku":
        part.sku = data[key];
        break;

      //-- part name cases
      case "part_name":
        part.partName = data[key];
        break;
      case "Part_name":
        part.partName = data[key];
        break;
      case "Part_Name":
        part.partName = data[key];
        break;
      case "part_Name":
        part.partName = data[key];
        break;
      case "part name":
        part.partName = data[key];
        break;
      case "Part name":
        part.partName = data[key];
        break;
      case "Part Name":
        part.partName = data[key];
        break;
      case "part Name":
        part.partName = data[key];
        break;
      // alt sku cases
      case "alt_part_no":
        part.alt_partNo = data[key];
        break;
      case "alt_vendor_no":
        part.alt_vendorNo = data[key];
        break;
      case "alt_sku":
        part.alt_sku = data[key];
        break;
      //--------------------------------//
      //           fitment cases        //
      //--------------------------------//

      //-- type cases
      case "type":
        part.fitting.type = data[key];
        break;
      case "Type":
        part.fitting.type = data[key];
        break;
      case "TYPE":
        part.fitting.type = data[key];
        break;

      //-- manufacturer cases
      case "make":
        part.fitting.manufacturer = data[key];
        break;
      case "manufacturer":
        part.fitting.manufacturer = data[key];
        break;
      case "Make":
        part.fitting.manufacturer = data[key];
        break;
      case "Manufacturer":
        part.fitting.manufacturer = data[key];
        break;
      case "Manufacturer Name":
        part.fitting.manufacturer = data[key];
        break;
      case "MAKE":
        part.fitting.manufacturer = data[key];
        break;
      case "MANUFACTURER":
        part.fitting.manufacturer = data[key];
        break;
      case "MANUFACTURER NAME":
        part.fitting.manufacturer = data[key];
        break;

      //-- model cases
      case "model":
        part.fitting.model = data[key];
        break;
      case "Model":
        part.fitting.model = data[key];
        break;
      case "MODEL":
        part.fitting.model = data[key];
        break;

      //-- cc cases
      case "cc":
        part.fitting.cc = data[key];
        break;
      case "Cc":
        part.fitting.cc = data[key];
        break;
      case "CC":
        part.fitting.cc = data[key];
        break;

      //-- display name cases
      case "display_name":
        part.fitting.display_name = data[key];
        break;
      case "Display Name":
        part.fitting.display_name = data[key];
        break;
      case "DISPLAY NAME":
        part.fitting.display_name = data[key];
        break;
      case "displayname":
        part.fitting.display_name = data[key];
        break;
      case "Displayname":
        part.fitting.display_name = data[key];
        break;
      case "DISPLAYNAME":
        part.fitting.display_name = data[key];
        break;
      case "displayName":
        part.fitting.display_name = data[key];
        break;
      case "DisplayName":
        part.fitting.display_name = data[key];
        break;

      //-- date from cases
      case "date_from":
        part.fitting.date_from = data[key];
        break;
      case "Date From":
        part.fitting.date_from = data[key];
        break;
      case "DATE FROM":
        part.fitting.date_from = data[key];
        break;
      case "datefrom":
        part.fitting.date_from = data[key];
        break;
      case "Datefrom":
        part.fitting.date_from = data[key];
        break;
      case "DATEFROM":
        part.fitting.date_from = data[key];
        break;
      case "dateFrom":
        part.fitting.date_from = data[key];
        break;
      case "DateFrom":
        part.fitting.date_from = data[key];
        break;
      case "year_from":
        part.fitting.date_from = data[key];
        break;
      case "Year From":
        part.fitting.date_from = data[key];
        break;
      case "YEAR FROM":
        part.fitting.date_from = data[key];
        break;
      case "yearfrom":
        part.fitting.date_from = data[key];
        break;
      case "Yearfrom":
        part.fitting.date_from = data[key];
        break;
      case "YEARFROM":
        part.fitting.date_from = data[key];
        break;
      case "yearFrom":
        part.fitting.date_from = data[key];
        break;
      case "YearFrom":
        part.fitting.date_from = data[key];
        break;

      //-- date to cases
      case "date_to":
        part.fitting.date_to = data[key];
        break;
      case "Date To":
        part.fitting.date_to = data[key];
        break;
      case "DATE TO":
        part.fitting.date_to = data[key];
        break;
      case "dateto":
        part.fitting.date_to = data[key];
        break;
      case "Dateto":
        part.fitting.date_to = data[key];
        break;
      case "DATETO":
        part.fitting.date_to = data[key];
        break;
      case "dateTo":
        part.fitting.date_to = data[key];
        break;
      case "DateTo":
        part.fitting.date_to = data[key];
        break;
      case "date_to":
        part.fitting.date_to = data[key];
        break;
      case "Date To":
        part.fitting.date_to = data[key];
        break;
      case "DATE TO":
        part.fitting.date_to = data[key];
        break;
      case "dateto":
        part.fitting.date_to = data[key];
        break;
      case "Dateto":
        part.fitting.date_to = data[key];
        break;
      case "DATETO":
        part.fitting.date_to = data[key];
        break;
      case "year_to":
        part.fitting.date_to = data[key];
        break;
      case "Year To":
        part.fitting.date_to = data[key];
        break;
      case "YEAR TO":
        part.fitting.date_to = data[key];
        break;
      case "yearto":
        part.fitting.date_to = data[key];
        break;
      case "Yearto":
        part.fitting.date_to = data[key];
        break;
      case "YEARTO":
        part.fitting.date_to = data[key];
        break;
      case "yearTo":
        part.fitting.date_to = data[key];
        break;
      case "YearTo":
        part.fitting.date_to = data[key];
        break;

      // -- year on cases
      case "year_on":
        part.fitting.year_on = data[key];
        break;
      case "Year On":
        part.fitting.year_on = data[key];
        break;
      case "YEAR ON":
        part.fitting.year_on = data[key];
        break;
      case "yearon":
        part.fitting.year_on = data[key];
        break;
      case "Yearon":
        part.fitting.year_on = data[key];
        break;
      case "YEARON":
        part.fitting.year_on = data[key];
        break;
      case "yearOn":
        part.fitting.year_on = data[key];
        break;
      case "YearOn":
        part.fitting.year_on = data[key];
        break;
      case "date_on":
        part.fitting.year_on = data[key];
        break;
      case "Date On":
        part.fitting.year_on = data[key];
        break;
      case "DATE ON":
        part.fitting.year_on = data[key];
        break;
      case "dateon":
        part.fitting.year_on = data[key];
        break;
      case "Dateon":
        part.fitting.year_on = data[key];
        break;
      case "DATEON":
        part.fitting.year_on = data[key];
        break;
      case "dateOn":
        part.fitting.year_on = data[key];
        break;
      case "DateOn":
        part.fitting.year_on = data[key];
        break;

    }
  }



  if (part.date_on == null || part.date_on == "" || part.date_on == undefined) {
    part.date_on = 0;
  }

  return part;
}

function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

module.exports = router;
