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
    )
  } catch (err) {
    throw err;
  }

  //

  for (let i = 0; i < fitting_data.length; i++) {
    let element = fitting_data[i];
    console.log(element);
    let fittingId = 0;
    try {
      const addNewPartFitting = await db.pool.query(
        "INSERT INTO `fitting` (type, manufacturer, model, cc, date_from, date_to, date_on) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          element.type,
          element.make,
          element.model,
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
      )
    } catch (err) {
      throw err;
    }


  res.status(200).send({
    message: "Part created",
  });

});

/*router.post("/display_bike", async (req, res) => {
  let part = req.body;
  if (!part.cc) {
    part.cc = getCCfromModel(part.bikeModel);
  }
  if (!part.date_on) {
    part.date_on = 0;
  }

  let userId = part.userId;
  let partId = 0;
  let displayBikeId = 0;

  let addedPart = {
    // manufacturer data
    itemNo: part.itemNo,
    vendorNo: part.vendorNo,
    bikeProducer: part.bikeProducer,
    bikeModel: part.bikeModel,
    cc: part.cc,
    // user specific data
    partSKU: part.partSKU,
    partName: part.partName,
    displayName: part.displayName,
    addPartNo1: part.addPartNo1,
    addPartNo2: part.addPartNo2,
    addPartNo3: part.addPartNo3,
    // part fitting data
    date_from: part.date_from,
    date_to: part.date_to,
    date_on: part.date_on,
  };

  try {
    const updatePart = await db.pool.query(
      "INSERT INTO `parts` (itemNo, vendorNo, bikeProducer, bikeModel, cc, date_from, date_to, date_on) VALUES (?,?,?,?,?,?,?,?)",
      [
        part.itemNo,
        part.vendorNo,
        part.bikeProducer,
        part.bikeModel,
        part.cc,
        part.date_from,
        part.date_to,
        part.date_on,
      ]
    );
    partId = parseInt(updatePart.insertId);
    /*try {
      const result = await db.pool.query(
        "INSERT INTO `display_bikes` (user_id, bike_display_name) VALUES (?, ?)",
        [userId, part.displayName]
      );
      displayBikeId = parseInt(result.insertId);
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw error;
  }

  try {
    const createDisplayBike = await db.pool.query(
      "INSERT INTO `display_bikes` (user_id, bike_display_name, sku, part_name, alt_part_num_1, alt_part_num_2, alt_part_num_3) VALUES (?, ?, ?, ? ,?, ?, ?)",
      [
        part.userId,
        part.displayName,
        part.partSKU,
        part.partName,
        part.addPartNo1,
        part.addPartNo2,
        part.addPartNo3,
      ]
    );
    displayBikeId = parseInt(createDisplayBike.insertId);
  } catch (err) {
    throw err;
  }

  try {
    const result = await db.pool.query(
      "INSERT INTO `parts_of_bikes` (display_bike_id, part_id) VALUES (?, ?)",
      [displayBikeId, partId]
    );
  } catch (err) {
    throw err;
  }

  res
    .status(200)
    .send({
      message: "Part added successfully",
      partId: partId,
      displayBikeId: displayBikeId,
      userId: part.userId,
      part: addedPart,
    })
    .end();
});
*/

/*router.post("/display_bike", async (req, res) => {
  let task = req.body;
  let uId = task.userId;

  let itemNo = task.itemNo;
  let vendorNo = task.vendorNo;
  let bikeProducer = task.bikeProducer;
  let bikeModel = task.bikeModel;
  let cc = task.cc;
  if (!cc) {
    cc = getCCfromModel(bikeModel);
  }
  let date_from = task.date_from;
  let date_to = task.date_to;
  let date_on = task.date_on;
  if (!date_on || date_on == undefined) {
    date_on = 0;
  }

  let newPart = {
    itemNo: itemNo,
    vendorNo: vendorNo,
    bikeProducer: bikeProducer,
    bikeModel: bikeModel,
    cc: cc,
    date_from: date_from,
    date_to: date_to,
    date_on: date_on,
    displayBikeId,
  };

  let displayName = task.displayName;
  let partId;
  let displayBikeId = "";
  let error = "";

  try {
    const result = await db.pool.query(
      "INSERT INTO `parts` (itemNo, vendorNo, bikeProducer, bikeModel, cc, date_from, date_to, date_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        itemNo,
        vendorNo,
        bikeProducer,
        bikeModel,
        cc,
        date_from,
        date_to,
        date_on,
      ]
    );
    partId = parseInt(result.insertId);
  } catch (err) {
    throw err;
  }

  res.send(200).json({
    message: "Part added",
    partId: partId,
  });

  /*try {
    const result = await db.pool.query(
      "INSERT INTO `display_bikes` (user_id, bike_display_name) VALUES (?, ?)",
      [uId, displayName]
    );
    displayBikeId = parseInt(result.insertId);
    newPart.displayBikeId = displayBikeId;
  } catch (err) {
    error = err;
  }

  try {
    const result = await db.pool.query(
      "INSERT INTO `parts_of_bikes` (display_bike_id, part_id) VALUES (?, ?)",
      [displayBikeId, partId]
    );
  } catch (err) {
    error = err;
  }
  if (error == "") {
    newPart.displayName = displayName;
    newPart.cc = cc;
    let responseBody = {
      message: "Part added successfully",
      part: newPart,
    };
    res.status(200).send(responseBody);
  } else {
    let responseBody = {
      message: "Error",
      error: error,
    };
    res.status(500).send(responseBody);
  }
  
});
*/

router.post("/user_parts", async (req, res) => {
  let task = req.body;
  let uId = task.userId;
  let sId = task.supplierId;

  try {

    const result = await db.pool.query(
      "SELECT `part`.id ,`part`.sku, `part`.part_name, `alt_skus`.partNo , `alt_skus`.vendorNo, `alt_skus`.alt_sku FROM `part` INNER JOIN `alt_skus` ON `part`.id = `alt_skus`.part_id WHERE `part`.supplier_id = ?",
      [sId]
    );
    console.log(result);
    res.send(result);
  } catch (err) {
    throw err;
  }
});

router.get(`/get_fitment/:supplierId/:partId`, (req, res) => {
  let supplierId = req.params.supplierId;
  let partId = req.params.partId;

  try {
    console.log('get fitments for part: ' + partId);
    const selectFitments = db.pool.query(
      "SELECT `fitting`.type, `fitting`.manufacturer, `fitting`.model, `fitting`.cc, `fitting`.date_from, `fitting`.date_to, `fitting`.date_on, `part`.id, `part`.sku FROM `fitting` INNER JOIN `part_has_fitting` ON `fitting`.id = `part_has_fitting`.fitting_id INNER JOIN `part` ON `part_has_fitting`.part_id = `part`.id WHERE `part`.supplier_id = ? AND `part`.id = ?",
      [supplierId, partId],
    );
    selectFitments.then((result) => {
      res.send(result);
    });

  } catch (err) {
    throw err;
  }
});

router.post("/add_fitment", async (req, res) => {
  let task = req.body;
  let partId = task.partId;
  let supplierId = task.supplierId;
  let type = task.type;
  let manufacturer = task.manufacturer;
  let model = task.model;
  let cc = task.cc;
  let date_from = task.date_from;
  let date_to = task.date_to;
  let date_on = task.date_on;

  let newFitment = {
    type: type,
    manufacturer: manufacturer,
    model: model,
    cc: cc,
    date_from: date_from,
    date_to: date_to,
    date_on: date_on,
  };

  let fitmentId = "";
  let error = "";

  try {
    const result = await db.pool.query(
      "INSERT INTO `fitting` (type, manufacturer, model, cc, date_from, date_to, date_on) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        type,
        manufacturer,
        model,
        cc,
        date_from,
        date_to,
        date_on,
      ]
    );
    fitmentId = parseInt(result.insertId);
  } catch (err) {
    throw err;
  }

  try {
    const result = await db.pool.query(
      "INSERT INTO `part_has_fitting` (part_id, part_supplier_id fitting_id) VALUES (?, ?, ?)",
      [partId, supplierId, fitmentId]
    );
  } catch (err) {
    error = err;
  }

  if (error == "") {
    let responseBody = {
      message: "Fitment added successfully",
      fitment: newFitment,
    };
    res.status(200).send(responseBody);
  } else {
    let responseBody = {
      message: "Error",
      error: error,
    };
    res.status(500).send(responseBody);
  }
});





router.post("/update_part", (req, res) => {
  let task = req.body;
  let partId = task.id;
  console.log(task);
  console.log(task.partNo)
  try {
    const updatePart = db.pool.query(
      "UPDATE `part` SET sku = ?, part_name = ? WHERE id = ?",
      [
        task.partSKU,
        task.partName,
        partId,
      ]
    );

    const updateAltSkus = db.pool.query(
      "UPDATE `alt_skus` SET partNo = ?, vendorNo = ?, alt_sku = ? WHERE part_id = ?",
      [
        task.partNo,
        task.vendorNo,
        task.partAltSKU,
        partId
      ]
    );
    updateAltSkus.then((result) => {
      res.send({
        message: "Part updated",
        partId: partId,

      });
    });
    //res.send(result);
  } catch (err) {
    throw err;
  }

  /*try {
    const result = db.pool.query(
      "UPDATE `display_bikes` SET bike_display_name = ? WHERE id = ?",
      [task.displayName, task.displayId]
    );
  } catch (err) {
    throw err;
  }*/
  //res.send("Part updated successfully");
});

router.delete("/delete_part", (req, res) => {
  console.log("deleting part");
  console.log(req.body);
  let task = req.body;
  let partId = task.id;
  let displayBikeId = task.displayBikeId;
  try {
    const result = db.pool.query(
      "DELETE FROM `parts_of_bikes` WHERE part_id = ? AND display_bike_id = ?",
      [partId, displayBikeId]
    );
  } catch (err) {
    throw err;
  }

  try {
    const result = db.pool.query("DELETE FROM `parts` WHERE id = ?", [partId]);
  } catch (err) {
    throw err;
  }

  try {
    const result = db.pool.query("DELETE FROM `display_bikes` WHERE id = ?", [
      displayBikeId,
    ]);
  } catch (err) {
    throw err;
  }

  res.send("Part deleted");
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
