const express = require("express");
const router = express.Router();

const db = require("../db/db.js");

router.get("/bike_producers/:userId", (req, res) => {
  let userId = req.params.userId;
  const result = db.pool
    .query(
      "SELECT DISTINCT `parts`.bikeProducer FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ?",
      [userId]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get("/bike_models/:bikeProducer/:userId", (req, res) => {
  let bikeProducer = req.params.bikeProducer;
  let userId = req.params.userId;
  console.log(bikeProducer);
  console.log(userId);
  const result = db.pool
    .query(
      "SELECT DISTINCT `parts`.bikeModel FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ?",
      [userId, bikeProducer]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get("/bike_cc/:bikeProducer/:bikeModel/:userId", (req, res) => {
  let bikeProducer = req.params.bikeProducer;
  let bikeModel = req.params.bikeModel;
  let userId = req.params.userId;
  console.log(bikeProducer);
  console.log(bikeModel);
  const result = db.pool
    .query(
      "SELECT DISTINCT `parts`.cc FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ? AND `parts`.bikeModel = ?",
      [userId, bikeProducer, bikeModel]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get(
  "/bike_year_from/:bikeProducer/:bikeModel/:bike_cc/:userId",
  (req, res) => {
    let bikeProducer = req.params.bikeProducer;
    let bikeModel = req.params.bikeModel;
    let bike_cc = req.params.bike_cc;
    let userId = req.params.userId;
    console.log(bikeProducer);
    console.log(bikeModel);
    console.log(bike_cc);
    const result = db.pool
      .query(
        "SELECT DISTINCT `parts`.date_from FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ? AND `parts`.bikeModel = ? AND `parts`.cc = ?",
        [userId, bikeProducer, bikeModel, bike_cc]
      )
      .then((result) => {
        res.send(result);
      });
  }
);

router.get(
  "/bike_year_to/:bikeProducer/:bikeModel/:bike_cc/:bike_year_from/:userId",
  (req, res) => {
    let bikeProducer = req.params.bikeProducer;
    let bikeModel = req.params.bikeModel;
    let bike_cc = req.params.bike_cc;
    let bike_year_from = req.params.bike_year_from;
    let userId = req.params.userId;
    console.log(bikeProducer);
    console.log(bikeModel);
    console.log(bike_cc);
    console.log(bike_year_from);
    const searchDateTo = db.pool
      .query(
        "SELECT DISTINCT `parts`.date_to FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ? AND `parts`.bikeModel = ? AND `parts`.cc = ? AND `parts`.date_from = ?",
        [userId, bikeProducer, bikeModel, bike_cc, bike_year_from]
      )
      .then((result) => {
        res.send(result);
      });
  }
);

router.get(
  "/part/:bikeProducer/:bikeModel/:bike_cc/:bike_year_from/:bike_year_to/:userId",
  (req, res) => {
    let bikeProducer = req.params.bikeProducer;
    let bikeModel = req.params.bikeModel;
    let bike_cc = req.params.bike_cc;
    let bike_year_from = req.params.bike_year_from;
    let bike_year_to = req.params.bike_year_to;
    let userId = req.params.userId;
    console.log(bikeProducer);
    console.log(bikeModel);
    console.log(bike_cc);
    console.log(bike_year_from);
    console.log(bike_year_to);
    const result = db.pool
      .query(
        "SELECT `parts`.id, `parts`.itemNo, `parts`.vendorNo, `parts`.bikeProducer, `parts`.bikeModel, `display_bikes`.bike_display_name, `parts`.cc, `parts`.date_from, `parts`.date_to FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ? AND `parts`.bikeModel = ? AND `parts`.cc = ? AND `parts`.date_from = ? AND `parts`.date_to = ?",
        [userId, bikeProducer, bikeModel, bike_cc, bike_year_from, bike_year_to]
      )
      .then((result) => {
        res.send(result);
      });
  }
);

router.get("/part/:bikeProducer/:bikeModel/:bike_cc/:userId", (req, res) => {
  let bikeProducer = req.params.bikeProducer;
  let bikeModel = req.params.bikeModel;
  let bike_cc = req.params.bike_cc;
  let userId = req.params.userId;
  console.log(bikeProducer);
  console.log(bikeModel);
  console.log(bike_cc);
  const result = db.pool
    .query(
      "SELECT `parts`.id, `parts`.itemNo, `parts`.vendorNo, `parts`.bikeProducer, `parts`.bikeModel, `display_bikes`.bike_display_name, `parts`.cc, `parts`.date_from, `parts`.date_to FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ? AND `parts`.bikeModel = ? AND `parts`.cc = ?",
      [userId, bikeProducer, bikeModel, bike_cc]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get(
  "/part/:bikeProducer/:bikeModel/:bike_cc/bike_year_from/:userId",
  (req, res) => {
    let bikeProducer = req.params.bikeProducer;
    let bikeModel = req.params.bikeModel;
    let bike_cc = req.params.bike_cc;
    let bike_year_from = req.params.bike_year_from;
    let userId = req.params.userId;

    console.log(bikeProducer);
    console.log(bikeModel);
    console.log(bike_cc);
    console.log(bike_year_from);
    const result = db.pool
      .query(
        "SELECT `parts`.id, `parts`.itemNo, `parts`.vendorNo, `parts`.bikeProducer, `parts`.bikeModel, `display_bikes`.bike_display_name, `parts`.cc, `parts`.date_from, `parts`.date_to FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ? AND `parts`.bikeModel = ? AND `parts`.cc = ? AND `parts`.date_from = ?",
        [userId, bikeProducer, bikeModel, bike_cc, bike_year_from]
      )
      .then((result) => {
        res.send(result);
      });
  }
);

router.get("/part/:bikeProducer/:bikeModel/:bike_cc/:userId", (req, res) => {
  let bikeProducer = req.params.bikeProducer;
  let bikeModel = req.params.bikeModel;
  let bike_cc = req.params.bike_cc;
  let userId = req.params.userId;
  console.log(bikeProducer);
  console.log(bikeModel);
  console.log(bike_cc);
  const result = db.pool
    .query(
      "SELECT `parts`.id, `parts`.itemNo, `parts`.vendorNo, `parts`.bikeProducer, `parts`.bikeModel, `display_bikes`.bike_display_name, `parts`.cc, `parts`.date_from, `parts`.date_to FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ? AND `parts`.bikeModel = ? AND `parts`.cc = ?",
      [userId, bikeProducer, bikeModel, bike_cc]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get("/part/:bikeProducer/:bikeModel/:userId", (req, res) => {
  let bikeProducer = req.params.bikeProducer;
  let bikeModel = req.params.bikeModel;
  let userId = req.params.userId;
  console.log(bikeProducer);
  console.log(bikeModel);
  const result = db.pool
    .query(
      "SELECT `parts`.id, `parts`.itemNo, `parts`.vendorNo, `parts`.bikeProducer, `parts`.bikeModel, `display_bikes`.bike_display_name, `parts`.cc, `parts`.date_from, `parts`.date_to FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ? AND `parts`.bikeModel = ?",
      [userId, bikeProducer, bikeModel]
    )
    .then((result) => {
      res.send(result);
    });
});

router.get("/part/:bikeProducer/:userId", (req, res) => {
  let bikeProducer = req.params.bikeProducer;
  let userId = req.params.userId;
  console.log(bikeProducer);
  const result = db.pool
    .query(
      "SELECT `parts`.id, `parts`.itemNo, `parts`.vendorNo, `parts`.bikeProducer, `parts`.bikeModel, `display_bikes`.bike_display_name, `parts`.cc, `parts`.date_from, `parts`.date_to FROM `parts` JOIN `parts_of_bikes` ON `parts`.id = `parts_of_bikes`.part_id JOIN `display_bikes` ON `display_bikes`.id = `parts_of_bikes`.display_bike_id WHERE `display_bikes`.user_id = ? AND `parts`.bikeProducer = ?",
      [userId, bikeProducer]
    )
    .then((result) => {
      res.send(result);
    });
});

module.exports = router;
