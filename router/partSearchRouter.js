const express = require("express");
const router = express.Router();

const db = require("../db/db.js");

router.get("/manufacturer/:sId", (req, res) => {
  let sId = req.params.sId;
  // get distinct manufacturer from fitting table where supplier Id =  sId from part has fitting table
  const result = db.pool
    .query(
      "SELECT DISTINCT manufacturer FROM `fitting` WHERE id IN (SELECT fitting_id FROM `part_has_fitting` WHERE part_supplier_id = ?)",
      [sId]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get("/models/:manufacturer/:sId", (req, res) => {
  let manufacturer = req.params.manufacturer;
  let sId = req.params.sId;

  const result = db.pool
    .query(
      "SELECT DISTINCT model FROM `fitting` WHERE manufacturer = ? AND id IN (SELECT fitting_id FROM `part_has_fitting` WHERE part_supplier_id = ?)",
      [manufacturer, sId]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get("/cc/:manufacturer/:model/:sId", (req, res) => {
  let manufacturer = req.params.manufacturer;
  let model = req.params.model;
  let sId = req.params.sId;

  const result = db.pool
    .query(
      "SELECT DISTINCT cc FROM `fitting` WHERE manufacturer = ? AND model = ? AND id IN (SELECT fitting_id FROM `part_has_fitting` WHERE part_supplier_id = ?)",
      [manufacturer, model, sId]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get("/year_from/:manufacturer/:model/:cc/:sId", (req, res) => {
  let manufacturer = req.params.manufacturer;
  let model = req.params.model;
  let cc = req.params.cc;
  let sId = req.params.sId;

  const result = db.pool
    .query(
      "SELECT DISTINCT date_from FROM `fitting` WHERE manufacturer = ? AND model = ? AND cc = ? AND id IN (SELECT fitting_id FROM `part_has_fitting` WHERE part_supplier_id = ?)",
      [manufacturer, model, cc, sId]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get("/year_to/:manufacturer/:model/:cc/:year_from/:sId", (req, res) => {
  let manufacturer = req.params.manufacturer;
  let model = req.params.model;
  let cc = req.params.cc;
  let year_from = req.params.year_from;
  let sId = req.params.sId;

  const searchDateTo = db.pool
    .query(
      "SELECT DISTINCT date_to FROM `fitting` WHERE manufacturer = ? AND model = ? AND cc = ? AND date_from = ? AND id IN (SELECT fitting_id FROM `part_has_fitting` WHERE part_supplier_id = ?)",
      [manufacturer, model, cc, year_from, sId]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get(
  "/part/:manufacturer/:model/:cc/:year_from/:year_to/:sId",
  (req, res) => {
    let manufacturer = req.params.manufacturer;
    let model = req.params.model;
    let cc = req.params.cc;
    let year_from = req.params.year_from;
    let year_to = req.params.year_to;
    let sId = req.params.sId;

    console.log(manufacturer, model, cc, year_from, year_to, sId);

    let pIds = [];

    const result = db.pool
      .query(
        "SELECT part_id FROM `part_has_fitting` WHERE fitting_id IN (SELECT id FROM `fitting` WHERE manufacturer = ? AND model = ? AND cc = ? AND date_from = ? AND date_to = ?) AND part_supplier_id = ?",
        [manufacturer, model, cc, year_from, year_to, sId]
      )
      .then((result) => {
        result.forEach((element) => {
          pIds.push(element.part_id);
        });
      })
      .finally(() => {
        console.log(pIds);
        const result = db.pool
          .query(
            "SELECT part.sku, part.part_name, alt_skus.partNo, alt_skus.vendorNo, alt_skus.alt_sku FROM part LEFT JOIN alt_skus ON part.id = alt_skus.part_id WHERE part.id IN (?)",
            [pIds]
          )
          .then((result) => {
            res.send(result);
          });
      });
  }
);

router.get("/part/:manufacturer/:model/:cc/:year_from/:sId", (req, res) => {
  let manufacturer = req.params.manufacturer;
  let model = req.params.model;
  let cc = req.params.cc;
  let year_from = req.params.year_from;
  let sId = req.params.sId;
  let pIds = [];

  const result = db.pool
    .query(
      "SELECT part_id FROM `part_has_fitting` WHERE fitting_id IN (SELECT id FROM `fitting` WHERE manufacturer = ? AND model = ? AND cc = ? AND date_from = ? AND id IN (SELECT fitting_id FROM `part_has_fitting` WHERE part_supplier_id = ?))",
      [manufacturer, model, cc, year_from, sId]
    )
    .then((result) => {
      result.forEach((element) => {
        pIds.push(element.part_id);
      });
    })
    .finally(() => {
      const result = db.pool
        .query(
          "SELECT part.sku, part.part_name, alt_skus.partNo, alt_skus.vendorNo, alt_skus.alt_sku FROM part LEFT JOIN alt_skus ON part.id = alt_skus.part_id WHERE part.id IN (?)",
          [pIds]
        )
        .then((result) => {
          res.send(result);
        });
    });
});

router.get("/part/:manufacturer/:model/:cc/:sId", (req, res) => {
  let manufacturer = req.params.manufacturer;
  let model = req.params.model;
  let cc = req.params.cc;
  let sId = req.params.sId;
  let pIds = [];

  const result = db.pool
    .query(
      "SELECT part_id FROM `part_has_fitting` WHERE fitting_id IN (SELECT id FROM `fitting` WHERE manufacturer = ? AND model = ? AND cc = ?) AND part_supplier_id = ?",
      [manufacturer, model, cc, sId]
    )
    .then((result) => {
      result.forEach((element) => {
        pIds.push(element.part_id);
      });
    })
    .finally(() => {
      const result = db.pool
        .query(
          "SELECT part.sku, part.part_name, alt_skus.partNo, alt_skus.vendorNo, alt_skus.alt_sku FROM part LEFT JOIN alt_skus ON part.id = alt_skus.part_id WHERE part.id IN (?)",
          [pIds]
        )
        .then((result) => {
          res.send(result);
        });
    });
});

router.get("/part/:manufacturer/:model/:sId", (req, res) => {
  let manufacturer = req.params.manufacturer;
  let model = req.params.model;
  let sId = req.params.sId;

  let pIds = [];

  //"SELECT part_id FROM `part_has_fitting` WHERE fitting_id IN (SELECT id FROM `fitting` WHERE manufacturer = ?) AND part_supplier_id = ?",

  const result = db.pool
    .query(
      "SELECT part_id FROM `part_has_fitting` WHERE fitting_id IN (SELECT id FROM `fitting` WHERE manufacturer = ? AND model = ?) AND part_supplier_id = ?",
      [manufacturer, model, sId]
    )
    .then((result) => {
      result.forEach((element) => {
        pIds.push(element.part_id);
      });
    })
    .finally(() => {
      console.log(pIds);
      // find all parts from parts table where part id is in the array of part id's
      const result = db.pool
        // select part.sku, part.part_name, alt_skus.partNo, alt_skus.alt_partNo
        .query(
          "SELECT part.sku, part.part_name, alt_skus.partNo, alt_skus.vendorNo, alt_skus.alt_sku FROM part LEFT JOIN alt_skus ON part.id = alt_skus.part_id WHERE part.id IN (?)",
          [pIds]
        )
        .then((result) => {
          res.send(result);
        });
    });
});

router.get("/part/:manufacturer/:sId", (req, res) => {
  let manufacturer = req.params.manufacturer;
  let sId = req.params.sId;
  let pIds = [];

  const result = db.pool
    .query(
      "SELECT part_id FROM `part_has_fitting` WHERE fitting_id IN (SELECT id FROM `fitting` WHERE manufacturer = ?) AND part_supplier_id = ?",
      [manufacturer, sId]
    )
    .then((result) => {
      result.forEach((element) => {
        pIds.push(element.part_id);
      });
    })
    .finally(() => {
      // find all parts from parts table where part id is in the array of part id's
      const result = db.pool
        // select part.sku, part.part_name, alt_skus.partNo, alt_skus.alt_partNo
        .query(
          "SELECT part.sku, part.part_name, alt_skus.partNo, alt_skus.vendorNo, alt_skus.alt_sku FROM `part` JOIN `alt_skus` ON part.id = alt_skus.part_id WHERE part.id IN (?)",
          [pIds]
        )
        .then((result) => {
          res.send(result);
        });
    });
});

module.exports = router;
