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
  console.log("make_options")
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

router.get("/:type/make_options/sId", (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  let type = req.params.type;
  try {
    const query = db.pool.query(
      "SELECT DISTINCT `fitting`.manufacturer FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ? AND `fitting`.type = ?",
      [supplierId, type]
    )
    query.then((result) => {
      res.send(result);
    })
  }
  catch (err) {
    throw err;
  }
})

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

router.get("/totalParts/:sId", (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  try {
    const query = db.pool.query(
      "SELECT COUNT(*) AS totalParts FROM `part` WHERE `part`.supplier_id = ?",
      [supplierId]
    )
    query.then((result) => {
      let totalParts = result[0].totalParts;
      res.send(totalParts.toString());
    })
  }
  catch (err) {
    throw err;
  }
});

router.get("/totalFittings/:sId", (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  try {
    const query = db.pool.query(
      "SELECT COUNT(*) AS totalFittings FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ?",
      [supplierId]
    )
    query.then((result) => {
      let totalFittings = result[0].totalFittings;
      res.send(totalFittings.toString());
    })
  }
  catch (err) {
    throw err;
  }
});

// average amount of fittings per part
router.get("/avgFittings/:sId", (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  try {
    const query = db.pool.query(
      "SELECT COUNT(*) AS totalFittings FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ?",
      [supplierId]
    )
    query.then((result) => {
      console.log(result);
      let totalFittings = result[0].totalFittings;
      const query2 = db.pool.query(
        "SELECT COUNT(*) AS totalParts FROM `part` WHERE `part`.supplier_id = ?",
        [supplierId]
      )
      query2.then((result2) => {
        let totalParts = result2[0].totalParts;
        let avgFittings = totalFittings / totalParts;
        res.send(avgFittings.toString());
      })
    })
  }
  catch (err) {
    throw err;
  }
});

router.get("/commonCC/:sId", (req, res) => {
  let sId = req.params.sId;
  let supplierId = parseInt(sId);
  try {
    const query = db.pool.query(
      "SELECT `fitting`.cc, COUNT(*) AS count FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ? GROUP BY `fitting`.cc ORDER BY count DESC LIMIT 1",
      [supplierId]
    )
    query.then((result) => {
      let commonCC = result[0].cc;
      res.send(commonCC.toString());
    })
  }
  catch (err) {
    throw err;
  }
});





module.exports = router;
