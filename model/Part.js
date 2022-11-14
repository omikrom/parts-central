class Part {
  constructor(
    itemNo,
    vendorNo,
    barcodeNo,
    bikeProducer,
    bikeModel,
    country,
    date_from,
    date_to,
    date_on
  ) {
    this.itemNo = itemNo;
    this.vendorNo = vendorNo;
    this.barcodeNo = barcodeNo;
    this.bikeProducer = bikeProducer;
    this.bikeModel = bikeModel;
    this.cc = this.getCCfromModel(bikeModel);
    this.country = country;
    this.date_from = date_from;
    this.date_to = date_to;
    this.date_on = this.checkDateOn(date_on);
  }
  getCCfromModel(model) {
    let string = model;
    let words = string.split(" ");
    return words[1];
  }
  checkDateOn(value) {
    if (value == undefined) {
      return 0;
    } else {
      return value;
    }
  }
}

module.exports = Part;
