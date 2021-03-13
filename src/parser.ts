import { createSegmentsCollection } from "./screener.js";
/**
 * Parses through the edi data via segment object and generates XML templates according to given conditions
 * @param ediData data from .edi input file in string format
 */
export const parseData = (ediData: string) => {
  const segmentsCollection = createSegmentsCollection(ediData);
  const headerCollection: string[] = [];
  const salesCollection: string[] = [];
  const returnsCollection: string[] = [];
  const footerCollection: string[] = [];

  for (let i = 0; i < segmentsCollection.length; i++) {
    const segmentObject = segmentsCollection[i];
    const name = segmentObject.name;
    const composites = segmentObject.composites;
    const dataElements = segmentObject.dataElements;
    if (name === "UNB") {
      const UNBSection = `<interchangeHeader name="${name}" characterSet="${composites[1]}" senderGLN="${composites[2]}" recipientGLN="${composites[3]}" dateAndTime="${composites[4]}" interchangeNumber="${composites[5]}" isTest="${composites[6]}" docType="${composites[7]}"></interchangeHeader>`;
      headerCollection.push(UNBSection);
    }
    if (name === "UNH") {
      const UNHSection = `<messageHeader name="${name}" number="${composites[1]}" type="${dataElements[0]}" version="${dataElements[1]}${dataElements[2]}" controlAgency="${dataElements[3]}" EANVersion="${dataElements[4]}">${dataElements[0]}</messageHeader>`;
      headerCollection.push(UNHSection);
    }

    if (name === "BGM") {
      const BGMSection = `<messageStart name="${name}" docSubtype="${composites[1]}">${composites[2]}</messageStart>`;
      headerCollection.push(BGMSection);
    }
    if (name === "DTM") {
      if (dataElements[0] === "137") {
        const DTMSection = `<creationDate>${dataElements[1]}</creationDate>`;
        headerCollection.push(DTMSection);
      } else if (dataElements[0] === "90") {
        const DTMSection = `<reportStartDate>${dataElements[1]}</reportStartDate>`;
        headerCollection.push(DTMSection);
      } else if (dataElements[0] === "91") {
        const DTMSection = `<reportEndDate>${dataElements[1]}</reportEndDate>`;
        headerCollection.push(DTMSection);
      } else if (dataElements[0] === "356") {
        const DTMSection = `<salesDate>${dataElements[1]}</salesDate>`;
        if (segmentsCollection[i - 1].composites.includes("Verkauf")) {
          salesCollection.push(DTMSection);
        } else if (segmentsCollection[i - 1].composites.includes("Retoure")) {
          returnsCollection.push(DTMSection);
        }
      }
    }
    if (name === "NAD") {
      if (composites[1] === "SE") {
        const NADSection = `<sender>${dataElements[0]}</sender>`;
        headerCollection.push(NADSection);
      } else if (composites[1] === "SU") {
        const NADSection = `<supplier>${dataElements[0]}</supplier>`;
        headerCollection.push(NADSection);
      }
    }
    if (name === "CUX") {
      const CUXSection = `<currency>${dataElements[1]}</currency>`;
      headerCollection.push(CUXSection);
    }
    if (name === "LOC") {
      const LOCSection = `<location>${composites[2]}</location>`;
      if (composites.includes("Verkauf")) {
        salesCollection.push(LOCSection);
      } else if (composites.includes("Retoure")) {
        returnsCollection.push(LOCSection);
      }
    }

    if (name === "LIN") {
      const LINSection = `<lineItem number="${composites[1]}"><EAN>${dataElements[0]}</EAN></lineItem>`;
      if (segmentsCollection[i - 2].composites.includes("Verkauf")) {
        salesCollection.push(LINSection);
      } else if (segmentsCollection[i - 2].composites.includes("Retoure")) {
        returnsCollection.push(LINSection);
      }
    }

    if (name === "MOA") {
      const MOASection = `<grossPriceTotal>${dataElements[1]}</grossPriceTotal>`;
      // if ((dataElements.length = 3)) {
      //   const MOASection = `<grossPriceTotal><${dataElements[2]}>${dataElements[1]}</${dataElements[2]}></grossPriceTotal>`;
      // }
      if (segmentsCollection[i - 3].composites.includes("Verkauf")) {
        salesCollection.push(MOASection);
      } else if (segmentsCollection[i - 3].composites.includes("Retoure")) {
        returnsCollection.push(MOASection);
      }
    }

    if (name === "PRI") {
      const PRISection = `<grossPrice>${dataElements[1]}</grossPrice>`;
      if (segmentsCollection[i - 4].composites.includes("Verkauf")) {
        salesCollection.push(PRISection);
      } else if (segmentsCollection[i - 4].composites.includes("Retoure")) {
        returnsCollection.push(PRISection);
      }
    }

    if (name === "QTY") {
      const QTYSection = `<quantity typeCode="${dataElements[0]}">${dataElements[1]}</quantity>`;
      if (segmentsCollection[i - 5].composites.includes("Verkauf")) {
        salesCollection.push(QTYSection);
      } else if (segmentsCollection[i - 5].composites.includes("Retoure")) {
        returnsCollection.push(QTYSection);
      }
    }

    if (name === "UNT") {
      const UNTSection = `<messageTrailer numberOfSegments="${composites[1]}"></messageTrailer>`;
      footerCollection.push(UNTSection);
    }
  }
  // If I keep the array, the XML document will contain commas and procduces error
  const headerXML = removeCommasFromCollection(headerCollection);
  const salesXML = removeCommasFromCollection(salesCollection);
  const returnsXML = removeCommasFromCollection(returnsCollection);
  const footerXML = removeCommasFromCollection(footerCollection);
  const xmlDocument = `<?xml version='1.0' encoding='utf-8'?><root><header>${headerXML}</header><main><sales>${salesXML}</sales><returns>${returnsXML}</returns></main><footer>${footerXML}</footer></root>`;

  return xmlDocument;
};
/**
 * Little helper function to get rid of commas inside XML data
 * @param collection collection of xml strings for header, sales, return or footer sections of xml file
 */
const removeCommasFromCollection = (collection: string[]): string => {
  const collectionWithoutComma = collection.toString().replace(/,/g, "");
  return collectionWithoutComma;
};
