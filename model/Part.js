class Part {
  constructor(
    itemNo,
    vendorNo,
    bikeProducer,
    bikeModel,
    cc,
    date_from,
    date_to,
    date_on
  ) {
    this.itemNo = itemNo;
    this.vendorNo = vendorNo;
    this.bikeProducer = bikeProducer;
    this.bikeModel = bikeModel;
    this.cc = this.getCCfromModel(bikeModel);
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
