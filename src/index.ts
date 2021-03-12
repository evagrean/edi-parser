import fs from "fs-extra";
import { Segments } from "./types.js";

const ediTestFile = process.argv[2].toString();

const ediData = fs.readFileSync(ediTestFile).toString();

const SLPRPTSegments = {
  additionalInformation: "ALI",
  beginningOfMessage: "BGM",
  communicationContact: "COM",
  contactInformation: "CTA",
  currencies: "CUX",
  documentMessageDetails: "DOC",
  dateTimePeriod: "DTM",
  goodsIdentityNumber: "GIN",
  itemDescription: "IMD",
  lineItem: "LIN",
  placeLocationIdentification: "LOC",
  marketSalesChannelInformation: "MKS",
  monetaryAmount: "MOA",
  nameAndAddress: "NAD",
  package: "PAC",
  additionalProductId: "PIA",
  priceDetails: "PRI",
  quantity: "QTY",
  reference: "RFF",
  serviceStringAdvice: "UNA",
  interChangeHeader: "UNB",
  messageHeader: "UNH",
  messageTrailer: "UNT",
  interchangeTrailer: "UNZ",
};

let xml = [];

const createXML = (ediData: string) => {
  // groupSegments(ediData);
  // getEdiMessageHeaderData(ediMessageHeaderSegments);
};

const organizeSegments = (ediData: string) => {
  const segments = getSegments(ediData);
  const compositesStringsArray: string[][] = [];
  const segmentNamesArray: string[] = [];
  const dataElementsArray: string[][] = [];
  let messageHeader = {}; // UNH
  let interchangeHeader = {}; // UNB
  let beginningOfMessage = {}; // BGM
  let dateTimePeriod = {}; // DTM
  let nameAndAddress = {}; //NAD
  let currencies = {}; // CUX
  let placeLocationIdentification = {}; // LOC
  let lineItem = {}; // LIN
  let monetaryAmount = {}; // MOA
  let priceDetails = {}; // PRI
  let quantity = {}; // QTY

  // filter empty strings, if exist
  const filteredSegments = segments.filter((e) => e);

  for (let i = 0; i < filteredSegments.length; i++) {
    const segment = filteredSegments[i];

    const firstLetters = !segment.includes("UNA") ? segment.slice(2, 5) : "UNA";
    segmentNamesArray.push(firstLetters);

    const composites = segment.split("+");

    // filter empty strings, if exist
    const filteredComposites = composites.filter((e) => e);
    filteredComposites.shift();

    compositesStringsArray.push(filteredComposites);

    for (let string of compositesStringsArray[i]) {
      const dataElements = string.split(":");
      const filteredDataElements = dataElements.filter((e) => e);
      dataElementsArray.push(filteredDataElements);
    }

    const segmentObject = {
      segmentName: segmentNamesArray[i],
      // We don't need name characters here
      composites: compositesStringsArray[i],
      elements: "",
    };
    // hier nochmal for durchlaufen lassen???
    if (segmentObject.segmentName === "UNH") {
      messageHeader = {
        name: segmentObject.segmentName,
        documentNumber: segmentObject.composites[0],
        messageType: "",
        version: "",
        controlAgency: "",
        EANVersion: "",
      };
    } else if (segmentObject.segmentName === "UNB") {
      interchangeHeader = {
        name: segmentObject.segmentName,
        characterSet: segmentObject.composites[0],
        senderGLN: segmentObject.composites[1],
        recipientGLN: segmentObject.composites[2],
        date: segmentObject.composites[3],
        interchangeNumber: segmentObject.composites[4],
        isTest: "",
        docType: segmentObject.composites[6],
      };
    } else if (segmentObject.segmentName === "BGM") {
      beginningOfMessage = {
        name: segmentObject.segmentName,
        docSubtype: segmentObject.composites[0],
        docNumber: segmentObject.composites[1],
      };
    } else if (segmentObject.segmentName === "DTM") {
      const elements = segmentObject.composites[0].split(":");
      dateTimePeriod = {
        name: segmentObject.segmentName,
        typeOfDate: elements[0],
        date: elements[1],
        format: elements[2],
      };
    }
  }
  console.log(dateTimePeriod);
};

const getSegments = (ediData: string): Segments => {
  const segments = ediData.split("'");

  return segments;
};

organizeSegments(ediData);

// messageHeader contains Data from UNA?, UNB and UNH segment. Can probably be as attributes, not this important for being precessed in ERP system later
// messageBody contains BGM, DTM, NAD, CUX as <salesReportHeader>, <saleLocation>, <saleDate>, <article> with LIN, MOA, PRI, QYT, <returnLocation>, <returnDate>, <article> with LIN, MOA, PRI, QTY, <saleForeignCurrency> with resp. data
// messageTrailer contains Data from UNT and UNZ

const XMLOutput = process.argv[3].toString();

fs.writeFile(XMLOutput, xml, (err: any) => {
  if (err) throw err;
  console.log("XML generated");
});
