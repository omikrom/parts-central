const express = require("express");
const router = express.Router();

const db = require("../db/db.js");

router.post("/display_bike", async (req, res) => {
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
    }*/
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
  console.log(task);
  try {
    /*const result = await db.pool.query(
      "SELECT * FROM `display_bikes` WHERE user_id = ?",
      [uId]
    ); */
    const result = await db.pool.query(
      "SELECT `parts`.id, `parts`.itemNo, `parts`.vendorNo, `parts`.bikeProducer, `parts`.bikeModel, `parts`.cc, `parts`.date_from, `parts`.date_to, `parts`.date_on, `display_bikes`.bike_display_name, `display_bikes`.id AS `display_bike_id` FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ?",
      [uId]
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});

router.post("/update_part", (req, res) => {
  let task = req.body;
  let partId = task.id;
  console.log(task);
  try {
    const result = db.pool.query(
      "UPDATE `parts` SET itemNo = ?, vendorNo = ?, bikeProducer = ?, bikeModel = ?, cc = ?, date_from = ?, date_to = ?, date_on = ? WHERE id = ?",
      [
        task.itemNo,
        task.vendorNo,
        task.bikeProducer,
        task.bikeModel,
        task.cc,
        task.date_from,
        task.date_to,
        task.date_on,
        partId,
      ]
    );
    //res.send(result);
  } catch (err) {
    throw err;
  }

  try {
    const result = db.pool.query(
      "UPDATE `display_bikes` SET bike_display_name = ? WHERE id = ?",
      [task.displayName, task.displayId]
    );
  } catch (err) {
    throw err;
  }
  res.send("Part updated successfully");
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
