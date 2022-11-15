const express = require("express");
const router = express.Router();

const db = require("../db/db.js");

router.post("/display_bike", async (req, res) => {
  let task = req.body;
  let uId = task.userId;
  let displayName = task.displayName;
  let partId = task.partId;
  let displayBikeId = "";

  let resQ1 = "";
  let resQ2 = "";

  console.log(task);
  try {
    const result = await db.pool.query(
      "INSERT INTO `display_bikes` (user_id, bike_display_name) VALUES (?, ?)",
      [uId, displayName]
    );
    displayBikeId = result.insertId;
    resQ1 = result;
  } catch (err) {
    console.log(err);
  }

  try {
    const result2 = await db.pool.query(
      "INSERT INTO `parts_of_bikes` (display_bike_id, part_id) VALUES (?, ?)",
      [displayBikeId, partId]
    );
    resQ2 = result2;
  } catch (err) {
    console.log(err);
  }

  let responseBody = {
    message: "Part added to display bike",
  };

  res.status(200).send(responseBody);

  /*try {
    const result = await db.pool.query(
      "INSERT INTO `display_bike` (user_id, bike_display_name) VALUES (?, ?)",
      [uId, displayName]
    );
    displayBikeId = result.insertId;
    /*const result2 = await db.pool.query(
      "INSERT INTO `parts_of_bike` (part_ids, Display_bikes_id) VALUES (?, ?)",
      [partId, displayBikeId]
    );
  } catch (err) {
    throw err;
  } */
});

router.get("/user_parts/:userId", async (req, res) => {
  let uId = req.params.userId;
  try {
    /*const result = await db.pool.query(
      "SELECT * FROM `display_bikes` WHERE user_id = ?",
      [uId]
    ); */
    const result2 = await db.pool.query(
      "SELECT `part`.itemNo, `display_bikes`.bike_display_name FROM 'part' JOIN `parts_of_bikes` ON `part`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id"
    );
    res.send(result2);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
