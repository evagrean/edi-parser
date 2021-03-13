import fs from "fs-extra";
var ediTestFile = process.argv[2].toString();
var ediData = fs.readFileSync(ediTestFile).toString();
var SLPRPTSegments = {
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
var xml = [];
var createXML = function (ediData) {
    // groupSegments(ediData);
    // getEdiMessageHeaderData(ediMessageHeaderSegments);
};
var organizeSegments = function (ediData) {
    var segments = getSegments(ediData);
    console.log(segments);
    var compositesStringsArray = [];
    var segmentNamesArray = [];
    var dataElementsArray = [];
    var messageHeader = {}; // UNH
    var interchangeHeader = {}; // UNB
    var beginningOfMessage = {}; // BGM
    var dateTimePeriod = {}; // DTM
    var nameAndAddress = {}; //NAD
    var currencies = {}; // CUX
    var placeLocationIdentification = {}; // LOC
    var lineItem = {}; // LIN
    var monetaryAmount = {}; // MOA
    var priceDetails = {}; // PRI
    var quantity = {}; // QTY
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        var firstLetters = !segment.includes("UNA") ? segment.slice(2, 5) : "UNA";
        segmentNamesArray.push(firstLetters);
        var composites = segment.split("+");
        // filter empty strings, if exist
        var filteredComposites = composites.filter(function (e) { return e; });
        filteredComposites.shift();
        compositesStringsArray.push(filteredComposites);
        for (var _i = 0, _a = compositesStringsArray[i]; _i < _a.length; _i++) {
            var string = _a[_i];
            var dataElements = string.split(":");
            var filteredDataElements = dataElements.filter(function (e) { return e; });
            dataElementsArray.push(filteredDataElements);
        }
        var segmentObject = {
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
        }
        else if (segmentObject.segmentName === "UNB") {
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
        }
        else if (segmentObject.segmentName === "BGM") {
            beginningOfMessage = {
                name: segmentObject.segmentName,
                docSubtype: segmentObject.composites[0],
                docNumber: segmentObject.composites[1],
            };
        }
        else if (segmentObject.segmentName === "DTM") {
            var elements = segmentObject.composites[0].split(":");
            dateTimePeriod = {
                name: segmentObject.segmentName,
                typeOfDate: elements[0],
                date: elements[1],
                format: elements[2],
            };
        }
    }
    // console.log(dateTimePeriod);
};
/**
 * Creates an array from ediData string containing every segment from edi-file as a seperate string
 * @param ediData stringified data from .edi input file
 */
var getSegments = function (ediData) {
    var segments = ediData.split("'");
    // filter empty strings, if exist
    var filteredSegments = segments.filter(function (e) { return e; });
    return filteredSegments;
};
organizeSegments(ediData);
// messageHeader contains Data from UNA?, UNB and UNH segment. Can probably be as attributes, not this important for being precessed in ERP system later
// messageBody contains BGM, DTM, NAD, CUX as <salesReportHeader>, <saleLocation>, <saleDate>, <article> with LIN, MOA, PRI, QYT, <returnLocation>, <returnDate>, <article> with LIN, MOA, PRI, QTY, <saleForeignCurrency> with resp. data
// messageTrailer contains Data from UNT and UNZ
var XMLOutput = process.argv[3].toString();
fs.writeFile(XMLOutput, xml, function (err) {
    if (err)
        throw err;
    console.log("XML generated");
});
