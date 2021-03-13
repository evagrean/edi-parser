import { getSegmentObjects } from "./screener.js";
export var parseData = function (ediData) {
    var segmentsCollection = getSegmentObjects(ediData);
    var headerCollection = [];
    var salesCollection = [];
    var returnsCollection = [];
    var footerCollection = [];
    for (var i = 0; i < segmentsCollection.length; i++) {
        var segmentObject = segmentsCollection[i];
        var name_1 = segmentObject.name;
        var composites = segmentObject.composites;
        var dataElements = segmentObject.dataElements;
        if (name_1 === "UNB") {
            var UNBSection = "<interchangeHeader name=\"" + name_1 + "\" characterSet=\"" + composites[1] + "\" senderGLN=\"" + composites[2] + "\" recipientGLN=\"" + composites[3] + "\" dateAndTime=\"" + composites[4] + "\" interchangeNumber=\"" + composites[5] + "\" isTest=\"" + composites[6] + "\" docType=\"" + composites[7] + "\"></interchangeHeader>";
            headerCollection.push(UNBSection);
        }
        if (name_1 === "UNH") {
            var UNHSection = "<messageHeader name=\"" + name_1 + "\" number=\"" + composites[1] + "\" type=\"" + dataElements[0] + "\" version=\"" + dataElements[1] + dataElements[2] + "\" controlAgency=\"" + dataElements[3] + "\" EANVersion=\"" + dataElements[4] + "\">" + dataElements[0] + "</messageHeader>";
            headerCollection.push(UNHSection);
        }
        if (name_1 === "BGM") {
            var BGMSection = "<messageStart name=\"" + name_1 + "\" docSubtype=\"" + composites[1] + "\">" + composites[2] + "</messageStart>";
            headerCollection.push(BGMSection);
        }
        if (name_1 === "DTM") {
            if (dataElements[0] === "137") {
                var DTMSection = "<creationDate>" + dataElements[1] + "</creationDate>";
                headerCollection.push(DTMSection);
            }
            else if (dataElements[0] === "90") {
                var DTMSection = "<reportStartDate>" + dataElements[1] + "</reportStartDate>";
                headerCollection.push(DTMSection);
            }
            else if (dataElements[0] === "91") {
                var DTMSection = "<reportEndDate>" + dataElements[1] + "</reportEndDate>";
                headerCollection.push(DTMSection);
            }
            else if (dataElements[0] === "356") {
                var DTMSection = "<salesDate>" + dataElements[1] + "</salesDate>";
                if (segmentsCollection[i - 1].composites.includes("Verkauf")) {
                    salesCollection.push(DTMSection);
                }
                else if (segmentsCollection[i - 1].composites.includes("Retoure")) {
                    returnsCollection.push(DTMSection);
                }
            }
        }
        if (name_1 === "NAD") {
            if (composites[1] === "SE") {
                var NADSection = "<sender>" + dataElements[0] + "</sender>";
                headerCollection.push(NADSection);
            }
            else if (composites[1] === "SU") {
                var NADSection = "<supplier>" + dataElements[0] + "</supplier>";
                headerCollection.push(NADSection);
            }
        }
        if (name_1 === "CUX") {
            var CUXSection = "<currency>" + dataElements[1] + "</currency>";
            headerCollection.push(CUXSection);
        }
        if (name_1 === "LOC") {
            var LOCSection = "<location>" + composites[2] + "</location>";
            if (composites.includes("Verkauf")) {
                salesCollection.push(LOCSection);
            }
            else if (composites.includes("Retoure")) {
                returnsCollection.push(LOCSection);
            }
        }
        if (name_1 === "LIN") {
            var LINSection = "<lineItem number=\"" + composites[1] + "\"><EAN>" + dataElements[0] + "</EAN></lineItem>";
            if (segmentsCollection[i - 2].composites.includes("Verkauf")) {
                salesCollection.push(LINSection);
            }
            else if (segmentsCollection[i - 2].composites.includes("Retoure")) {
                returnsCollection.push(LINSection);
            }
        }
        if (name_1 === "MOA") {
            var MOASection = "<grossPriceTotal>" + dataElements[1] + "</grossPriceTotal>";
            // if ((dataElements.length = 3)) {
            //   const MOASection = `<grossPriceTotal><${dataElements[2]}>${dataElements[1]}</${dataElements[2]}></grossPriceTotal>`;
            // }
            if (segmentsCollection[i - 3].composites.includes("Verkauf")) {
                salesCollection.push(MOASection);
            }
            else if (segmentsCollection[i - 3].composites.includes("Retoure")) {
                returnsCollection.push(MOASection);
            }
        }
        if (name_1 === "PRI") {
            var PRISection = "<grossPrice>" + dataElements[1] + "</grossPrice>";
            if (segmentsCollection[i - 4].composites.includes("Verkauf")) {
                salesCollection.push(PRISection);
            }
            else if (segmentsCollection[i - 4].composites.includes("Retoure")) {
                returnsCollection.push(PRISection);
            }
        }
        if (name_1 === "QTY") {
            var QTYSection = "<quantity typeCode=\"" + dataElements[0] + "\">" + dataElements[1] + "</quantity>";
            if (segmentsCollection[i - 5].composites.includes("Verkauf")) {
                salesCollection.push(QTYSection);
            }
            else if (segmentsCollection[i - 5].composites.includes("Retoure")) {
                returnsCollection.push(QTYSection);
            }
        }
        if (name_1 === "UNT") {
            var UNTSection = "<messageTrailer numberOfSegments=\"" + composites[1] + "\"></messageTrailer>";
            footerCollection.push(UNTSection);
        }
    }
    // If I keep the array, the XML document will contain commas and procduces error
    var headerXML = removeCommasFromCollection(headerCollection);
    var salesXML = removeCommasFromCollection(salesCollection);
    var returnsXML = removeCommasFromCollection(returnsCollection);
    var footerXML = removeCommasFromCollection(footerCollection);
    var xmlDocument = "<?xml version='1.0' encoding='utf-8'?><root><header>" + headerXML + "</header><main><sales>" + salesXML + "</sales><returns>" + returnsXML + "</returns></main><footer>" + footerXML + "</footer></root>";
    return xmlDocument;
};
var removeCommasFromCollection = function (collection) {
    var collectionWithoutComma = collection.toString().replace(/,/g, "");
    return collectionWithoutComma;
};
