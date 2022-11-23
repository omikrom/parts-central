const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.js");
const fs = require("fs");
const readline = require("readline");
const Part = require("../model/Part.js");
const db = require("../db/db.js");

const { parse } = require('csv-parse');

router.post("/user_csv/:userId", upload.single("file"), async function (req, res) {
  let userId = req.params.userId;
  if (req.file == undefined) {
    return res.status(400).send({ message: "Please upload a CSV file!" });
  }
  if (getFileExtension(req.file.originalname) != "csv") {
    return res.status(400).send({ message: "Please upload a CSV file!" });
  }

  const input = fs.createReadStream(req.file.path);
  const rl = readline.createInterface({ input });
  var partsList = [];


  fs.createReadStream(req.file.path).pipe(parse({
    delimiter: ',',
    skip_empty_lines: true,
    bom: true,
    columns: true,
  }))
    .on('data', (data) => {
      partsList.push(createPart(data));
    })
    .on('error', (err) => {
      console.log(err);
    })
    .on('end', () => {
      populateDatabase(partsList, res, userId);
    })


});

async function deleteFile(path) {
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File deleted successfully");
    }
  })
}


async function populateDatabase(partsList, res, userId) {
  // WHILE LOCAL ASSIGN USER ID TO 1
  let partId = 0;
  let displayBikeId = 0;
  userId = 1;

  //for (let i = 0; i < partsList.length; i++) {
  let i = 0;

  try {
    const createPart = await db.pool.query(
      "INSERT INTO `parts` (itemNo, vendorNo, bikeProducer, bikeModel, cc, date_from, date_to, date_on) VALUES (?,?,?,?,?,?,?,?)",
      [partsList[i].manufacturerDetails.itemNo, partsList[i].manufacturerDetails.vendorNo, partsList[i].manufacturerDetails.bikeProducer, partsList[i].manufacturerDetails.bikeModel, partsList[i].manufacturerDetails.cc, partsList[i].partFitting.date_from, partsList[i].partFitting.date_to, partsList[i].partFitting.date_on]
    );
    partId = parseInt(createPart.insertId);
  } catch (error) {
    throw error;
  }

  try {
    const createDisplayBike = await db.pool.query(
      "INSERT INTO `display_bikes`(user_id, bike_display_name, sku, part_name, alt_part_num_1, alt_part_num_2, alt_part_num_3) VALUES(?, ?, ?, ? ,?, ?, ?)",
      [
        userId,
        partsList[i].partDetails.display_name,
        partsList[i].partDetails.partSKU,
        partsList[i].partDetails.partName,
        partsList[i].partDetails.altPart1,
        partsList[i].partDetails.altPart2,
        partsList[i].partDetails.altPart3,
      ],
    )
    displayBikeId = parseInt(createDisplayBike.insertId);
  } catch (error) {
    throw error;
  }

  try {
    const linkParts = await db.pool.query(
      "INSERT INTO `parts_of_bikes` (parts_id, display_bikes_id) VALUES (?, ?)",
      [partId, displayBikeId]
    )
  } catch (error) {
    throw error;
  }

  // }

  res.status(200).send({
    message: "Parts added to database",
    data: partsList
  });
}



function createPart(data) {
  // Structure part object
  let part = {
    manufacturerDetails: {
      itemNo: "",
      vendorNo: "",
      bikeProducer: "",
      bikeModel: "",
      cc: 0,
    },
    partDetails: {
      partSKU: "",
      partName: "",
      display_name: "",
      altPart1: "",
      altPart2: "",
      altPart3: "",
    },
    partFitting: {
      date_from: 0,
      date_to: 0,
      date_on: 0,
    }
  }
  // check through data and assign to part

  // manufacturerDetails
  if (data.ItemNumber) {
    part.manufacturerDetails.itemNo = data.ItemNumber;
  } else if (data.ItemNo) {
    part.manufacturerDetails.itemNo = data.ItemNo;
  } else if (data.Item_Number) {
    part.manufacturerDetails.itemNo = data.Item_Number;
  }

  if (data.VendorNumber) {
    part.manufacturerDetails.vendorNo = data.VendorNumber;
  } else if (data.VendorNo) {
    part.manufacturerDetails.vendorNo = data.VendorNo;
  } else if (data.Vendor_Number) {
    part.manufacturerDetails.vendorNo = data.Vendor_Number;
  }

  if (data.BikeManufacturer) {
    part.manufacturerDetails.bikeProducer = data.BikeManufacturer;
  } else if (data.BikeProducer) {
    part.manufacturerDetails.bikeProducer = data.BikeProducer;
  } else if (data.Bike_Manufacturer) {
    part.manufacturerDetails.bikeProducer = data.Bike_Manufacture
  }

  if (data.BikeModel) {
    part.manufacturerDetails.bikeModel = data.BikeModel;
  } else if (data.Bike_Model) {
    part.manufacturerDetails.bikeModel = data.Bike_Model;
  } else if (data.bikemodel) {
    part.manufacturerDetails.bikeModel = data.bikemodel;
  }

  if (data.CC) {
    part.manufacturerDetails.cc = data.CC;
  } else if (data.cc) {
    part.manufacturerDetails.cc = data.cc;
  } else if (data.Cc) {
    part.manufacturerDetails.cc = data.Cc;
  } else {
    part.manufacturerDetails.cc = 0;
  }

  // part details

  if (data.PartSKU) {
    part.partDetails.partSKU = data.PartSKU;
  } else if (data.Part_Sku) {
    part.partDetails.partSKU = data.Part_Sku;
  } else if (data.PartSku) {
    part.partDetails.partSKU = data.PartSku;
  } else if (data.SKU) {
    part.partDetails.partSKU = data.SKU;
  } else if (data.sku) {
    part.partDetails.partSKU = data.sku;
  }

  if (data.PartName) {
    part.partDetails.partName = data.PartName;
  } else if (data.Part_Name) {
    part.partDetails.partName = data.Part_Name;
  } else if (data.Name) {
    part.partDetails.partName = data.Name;
  } else if (data.name) {
    part.partDetails.partName = data.name;
  }

  if (data.DisplayName) {
    part.partDetails.display_name = data.DisplayName;
  } else if (data.Display_Name) {
    part.partDetails.display_name = data.Display_Name;
  } else if (data.display_name) {
    part.partDetails.display_name = data.display_name;
  } else if (data.displayname) {
    part.partDetails.display_name = data.displayname;
  }

  if (data.AltPart1) {
    part.partDetails.altPart1 = data.AltPart1;
  } else if (data.Alt_Part1) {
    part.partDetails.altPart1 = data.Alt_Part1;
  } else if (data.altPart1) {
    part.partDetails.altPart1 = data.altPart1;
  } else if (data.alt_part1) {
    part.partDetails.altPart1 = data.alt_part1;
  } else if (data.altPartNumber1) {
    part.partDetails.altPart1 = data.altPartNumber1;
  } else if (data.altPart_Number1) {
    part.partDetails.altPart1 = data.altPart_Number1;
  } else if (data.alt_part_number1) {
    part.partDetails.altPart1 = data.alt_part_number1;
  }


  // part fitting

  if (data.From) {
    part.partFitting.date_from = data.From;
  } else if (data.from) {
    part.partFitting.date_from = data.from;
  } else if (data.DateFrom) {
    part.partFitting.date_from = data.DateFrom;
  } else if (data.Date_From) {
    part.partFitting.date_from = data.Date_From;
  } else if (data.date_from) {
    part.partFitting.date_from = data.date_from;
  }

  if (data.To) {
    part.partFitting.date_to = data.To;
  } else if (data.to) {
    part.partFitting.date_to = data.to;
  } else if (data.DateTo) {
    part.partFitting.date_to = data.DateTo;
  } else if (data.Date_To) {
    part.partFitting.date_to = data.Date_To;
  } else if (data.date_to) {
    part.partFitting.date_to = data.date_to;
  }

  if (data.On) {
    part.partFitting.date_on = data.On;
  } else if (data.on) {
    part.partFitting.date_on = data.on;
  } else if (data.DateOn) {
    part.partFitting.date_on = data.DateOn;
  } else if (data.Date_On) {
    part.partFitting.date_on = data.Date_On;
  } else if (data.date_on) {
    part.partFitting.date_on = data.date_on;
  }
  return part;
}


async function addUserPartsToDatabase(parts, res) {
  for (let i = 0; i < parts.length; i++) {
    /*try {
      const result = await db.pool.query(
        "INSERT INTO `parts` (itemNo, vendorNo, barcodeNo, bikeProducer, bikeModel, cc, date_from, date_to, date_on, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          parts[i].itemNo,
          parts[i].vendorNo,
          parts[i].barcodeNo,
          parts[i].bikeProducer,
          parts[i].bikeModel,
          parts[i].cc,
          parts[i].date_from,
          parts[i].date_to,
          parts[i].date_on,
          parts[i].country,
        ]
      );
      console.log("new part created");
    } catch (error) {
      console.log(error);
    }*/
  }
  res.status(200).send({
    message: "Parts added to database",
  });
}

router.post("/csv", upload.single("file"), async function (req, res) {
  console.log(req.file);
  let extension = getFileExtension(req.file.originalname);
  console.log(extension);
  if (extension == "csv") {
    const input = fs.createReadStream(req.file.path);
    const rl = readline.createInterface({ input });
    let data = [];

    rl.on("line", (row) => {
      data.push(row.split(","));
    });

    rl.on("close", () => {
      console.log("data length: ", data.length);
      let parts = createPartsList(data);
      addPartsToDatabase(parts, res);
    });
  }
});

function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

async function addPartsToDatabase(parts, res) {
  for (let i = 0; i < parts.length; i++) {
    try {
      const result = await db.pool.query(
        "INSERT INTO `parts` (itemNo, vendorNo, barcodeNo, bikeProducer, bikeModel, cc, date_from, date_to, date_on, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          parts[i].itemNo,
          parts[i].vendorNo,
          parts[i].barcodeNo,
          parts[i].bikeProducer,
          parts[i].bikeModel,
          parts[i].cc,
          parts[i].date_from,
          parts[i].date_to,
          parts[i].date_on,
          parts[i].country,
        ]
      );
      console.log("new part created");
    } catch (error) {
      console.log(error);
    }
  }
  res.status(200).send({
    message: "Parts added to database",
  });
}

function createPartsList(data) {
  let parts = [];
  for (let i = 1; i < data.length; i++) {
    let part = new Part(
      data[i][0],
      data[i][1],
      data[i][2],
      data[i][3],
      data[i][4],
      data[i][5],
      data[i][6],
      data[i][7],
      data[i][8]
    );
    parts.push(part);
  }
  return parts;
}

module.exports = router;
