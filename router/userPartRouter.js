const express = require("express");
const router = express.Router();

const db = require("../db/db.js");

router.post("/create_part_fitting", async (req, res) => {
  let data = req.body;
  let part = data.part;
  let supplierId = data.supplierId;
  let alt_data = data.alt_part_numbers;
  let fitting_data = data.fittings;
  let partId = 0;

  if (supplierId === 0) {
    res.status(403).send({
      message: "Supplier does not exist",
    });
  }

  // add new part
  try {
    const addNewPart = await db.pool.query(
      "INSERT INTO `part` (sku, part_name, supplier_id) VALUES (?, ?, ?)",
      [part.part_sku, part.part_name, supplierId]
    );
    partId = parseInt(addNewPart.insertId);
  } catch (err) {
    throw err;
  }

  try {
    const addAltData = await db.pool.query(
      "INSERT INTO `alt_skus` (partNo, vendorNo, alt_sku, part_id, part_supplier_id) VALUES (?, ?, ?, ?, ?)",
      [
        alt_data.alt_part_no,
        alt_data.alt_vendor_no,
        alt_data.alt_sku_no,
        partId,
        supplierId,
      ]
    );
  } catch (err) {
    throw err;
  }

  //

  for (let i = 0; i < fitting_data.length; i++) {
    let element = fitting_data[i];
    let fittingId = 0;
    try {
      const addNewPartFitting = await db.pool.query(
        "INSERT INTO `fitting` (type, manufacturer, model, display_name, cc, date_from, date_to, date_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          element.type,
          element.make,
          element.model,
          element.display_name,
          element.cc,
          element.year_from,
          element.year_to,
          element.year_on,
        ]
      );
      fittingId = parseInt(addNewPartFitting.insertId);
    } catch (err) {
      throw err;
    }

    try {
      const addNewJoin = await db.pool.query(
        "INSERT INTO `part_has_fitting` (part_id, part_supplier_id, fitting_id) VALUES (?, ?, ?)",
        [partId, supplierId, fittingId]
      );
    } catch (err) {
      throw err;
    }
  }

  res.status(200).send({
    message: "Part created",
  });
});

router.get("/part_count/:sId", (req, res) => {
  let supplierId = req.params.sId;
  let sId = parseInt(supplierId);
  let count = "";

  console.log(sId);

  const query = db.pool.query(
    "SELECT COUNT(*) AS count FROM `part` WHERE supplier_id = ?",
    [sId]
  );
  query.then((result) => {
    let num = result[0].count;
    count = num.toString();
    console.log(count);
    res.send(count);
  });
});

router.post("/user_parts/:limit/:offset", async (req, res) => {
  let task = req.body;
  let sId = task.supplierId;
  let limit = parseInt(req.params.limit);
  console.log(limit);
  let offset = parseInt(req.params.offset);
  console.log(offset);

  try {
    const result = await db.pool.query(
      "SELECT `part`.id ,`part`.sku, `part`.part_name, `alt_skus`.partNo , `alt_skus`.vendorNo, `alt_skus`.alt_sku FROM `part` INNER JOIN `alt_skus` ON `part`.id = `alt_skus`.part_id WHERE `part`.supplier_id = ? ORDER BY `part`.id LIMIT ? OFFSET ?",
      [sId, limit, offset]
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});

router.get(`/get_fitment/:supplierId/:partId`, (req, res) => {
  let supplierId = req.params.supplierId;
  let partId = req.params.partId;

  try {
    const selectFitments = db.pool.query(
      "SELECT `fitting`.id AS fitting_id, `fitting`.type, `fitting`.manufacturer, `fitting`.model, `fitting`.display_name, `fitting`.cc, `fitting`.date_from, `fitting`.date_to, `fitting`.date_on, `part`.id, `part`.sku FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ? AND `part`.id = ?",
      [supplierId, partId]
    );
    selectFitments.then((result) => {
      res.send(result);
    });
  } catch (err) {
    throw err;
  }
});

//

router.post("/add_fitment", async (req, res) => {
  console.log("received");
  let task = req.body;
  let partId = parseInt(task.partId);
  console.log("pId:", partId);
  let supplierId = parseInt(task.supplierId);
  console.log("sId:", supplierId);
  let type = task.type;
  let manufacturer = task.manufacturer;
  let model = task.model;
  let display_name = task.display_name;
  let cc = task.cc;
  let date_from = task.date_from;
  let date_to = task.date_to;
  let date_on = task.date_on;

  let newFitment = {
    type: type,
    manufacturer: manufacturer,
    model: model,
    display_name: display_name,
    cc: cc,
    date_from: date_from,
    date_to: date_to,
    date_on: date_on,
  };

  let fitmentId = "";
  let error = "";

  try {
    const result = await db.pool.query(
      "INSERT INTO `fitting` (type, manufacturer, model, display_name, cc, date_from, date_to, date_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [type, manufacturer, model, display_name, cc, date_from, date_to, date_on]
    );
    fitmentId = parseInt(result.insertId);
    console.log("added fitting to fitting table:", fitmentId);
  } catch (err) {
    throw err;
  }

  try {
    const result = await db.pool.query(
      "INSERT INTO `part_has_fitting` (part_id, part_supplier_id, fitting_id) VALUES (?, ?, ?)",
      [partId, supplierId, fitmentId]
    );
    console.log("added fitting to join table");
  } catch (err) {
    throw err;
  } finally {
    res.send({
      message: "fitment added",
    });
  }
});

router.post("/update_part", (req, res) => {
  let task = req.body;
  let partId = parseInt(task.id);
  let partName = task.partName;
  let sku = task.partSKU;
  let supplierId = parseInt(task.supplierId);
  let alt_part_no = task.partNo;
  let alt_vendor_no = task.vendorNo;
  let alt_sku_no = task.partAltSKU;

  try {
    const updatePart = db.pool.query(
      "UPDATE `part` SET sku = ?, part_name = ? WHERE id = ? AND supplier_id = ?",
      [sku, partName, partId, supplierId]
    );
  } catch (err) {
    res.status(404).send({
      message: "Could not update part",
    });
  } finally {
    try {
      const updateAltSkus = db.pool.query(
        "UPDATE `alt_skus` SET partNo = ?, vendorNo = ?, alt_sku = ? WHERE part_id = ? AND part_supplier_id = ?",
        [alt_part_no, alt_vendor_no, alt_sku_no, partId, supplierId]
      );
    } catch (err) {
      res.status(400).send({
        message: "Could not update alt skus",
      });
    }
  }
});

router.delete("/delete_part", async (req, res) => {
  console.log("deleting part");
  console.log(req.body);
  let task = req.body;
  let partId = parseInt(task.id);
  let sId = parseInt(task.sId);

  // get fittingIds for part
  let fittingIds = [];
  let deletedFittings = [];
  let deletedAltSkus = [];
  let deletedPart = [];

  // select fitting ids

  try {
    const selectFitments = await db.pool.query(
      "SELECT `fitting`.id FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ? AND `part`.id = ?",
      [sId, partId]
    );
    selectFitments.forEach((fitting) => {
      fittingIds.push(fitting.id);
    });
    /*selectFitments.then((result) => {
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        fittingIds.push(result[i].id);
      }
    });*/
  } catch (err) {
    throw err;
  } finally {
    //delete part_has_fitting
    for (let i = 0; i < fittingIds.length; i++) {
      try {
        const deletePartHasFitting = await db.pool.query(
          "DELETE FROM `part_has_fitting` WHERE part_id = ? AND part_supplier_id = ? AND fitting_id = ?",
          [partId, sId, fittingIds[i]]
        );
      } catch (err) {
        throw err;
      } finally {
        try {
          const deleteFitting = await db.pool.query(
            "DELETE FROM `fitting` WHERE id = ?",
            fittingIds[i]
          );
        } catch (err) {
          throw err;
        }
      }
    }
  }

  // select alt sku ids
  try {
    const selectAltSkus = await db.pool.query(
      "SELECT `alt_skus`.id FROM `alt_skus` INNER JOIN `part` ON `alt_skus`.part_id = `part`.id WHERE `part`.supplier_id = ? AND `part`.id = ?",
      [sId, partId]
    );
    try {
      const deleteAltSkus = db.pool.query(
        "DELETE FROM `alt_skus` WHERE part_id = ? AND part_supplier_id = ?",
        [partId, sId]
      );
      deleteAltSkus.then((result) => {
        deletedAltSkus.push(result);
      });
    } catch (err) {
      throw err;
    } finally {
      console.log("deleted alt skus: " + deletedAltSkus);
    }
  } catch (err) {
    throw err;
  } finally {
    //delete part
    try {
      const deletePart = await db.pool.query(
        "DELETE FROM `part` WHERE id = ? AND supplier_id = ?",
        [partId, sId]
      );
      console.log(deletePart);
    } catch (err) {
      throw err;
    } finally {
      res.status(200).send({
        message: "Part deleted successfully",
      });
    }
  }
});

router.post("/update_fitment", (req, res) => {
  let task = req.body;
  let fitmentId = parseInt(task.fitting_id);
  let type = task.type;
  let manufacturer = task.manufacturer;
  let model = task.model;
  let display_name = task.display_name;
  let cc = task.cc;
  let date_from = task.date_from;
  let date_to = task.date_to;
  let date_on = task.date_on;

  try {
    const updateFitment = db.pool
      .query(
        "UPDATE `fitting` SET type= ?, manufacturer = ?, model = ?, display_name = ?, cc = ?, date_from = ?, date_to = ?, date_on = ? WHERE id = ?",
        [
          type,
          manufacturer,
          model,
          display_name,
          cc,
          date_from,
          date_to,
          date_on,
          fitmentId,
        ]
      ) // update fitting
      .then((result) => {
        res.status(200).send({
          message: "Fitment updated successfully",
        });
      });
  } catch (err) {
    res.status(404).send({
      message: "Could not update fitment",
    });
  }
});

router.post("/delete_fitment", (req, res) => {
  let task = req.body;
  let fitmentId = parseInt(task.fitting_id);
  let partId = parseInt(task.partId);
  let supplierId = parseInt(task.sId);

  try {
    const deleteFitmentJoin = db.pool.query(
      "DELETE FROM `part_has_fitting` WHERE fitting_id = ? AND part_id = ? AND part_supplier_id = ?",
      [fitmentId, partId, supplierId]
    );
  } catch (err) {
    throw err;
  }

  try {
    const deleteFitment = db.pool.query(
      "DELETE FROM `fitting` WHERE id = ?",
      fitmentId
    );
    res.status(200).send({
      message: "Fitment deleted successfully",
    });
  } catch (err) {
    throw err;
  }
});

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

module.exports = router;
