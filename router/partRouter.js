const { query } = require("express");
const express = require("express");
const router = express.Router();

const db = require("../db/db.js");
const auth = require("../middleware/auth.js");

/*router.get("/show", async (req, res) => {
  console.log("create");
});*/

router.get("/type_options/:sId", async (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  try {
    const query = db.pool.query(
      "SELECT DISTINCT `fitting`.type FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ?",
      [supplierId]
    );
    query.then((result) => {
      res.send(result);
    })
  } catch (err) {
    throw err;
  }
});

router.get("/make_options/:sId", async (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  try {
    const query = db.pool.query(
      "SELECT DISTINCT `fitting`.manufacturer FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ?",
      [supplierId]
    )
    query.then((result) => {
      res.send(result);
    })
  } catch (err) {
    throw err;
  }
});

router.get("/model_options/:sId", async (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  try {
    const query = db.pool.query(
      "SELECT DISTINCT `fitting`.model FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ?",
      [supplierId]
    )
    query.then((result) => {
      res.send(result);
    })
  }
  catch (err) {
    throw err;
  }
});

router.get("/cc_options/:sId", async (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  try {
    const query = db.pool.query(
      "SELECT DISTINCT `fitting`.cc FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ?",
      [supplierId]
    )
    query.then((result) => {
      res.send(result);
    })
  }
  catch (err) {
    throw err;
  }
});

router.get("/:make/model_options/:sId", (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  let make = req.params.make;
  try {
    const query = db.pool.query(
      "SELECT DISTINCT `fitting`.model FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ? AND `fitting`.manufacturer = ?",
      [supplierId, make]
    )
    query.then((result) => {
      res.send(result);
    })
  }
  catch (err) {
    throw err;
  }
});






module.exports = router;
