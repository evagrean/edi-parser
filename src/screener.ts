import { SegmentObject } from "./types.js";

export const getSegmentObjects = (ediData: string) => {
  const segments = getSegments(ediData);
  const segmentsCollection = [];

  for (let segment of segments) {
    const segmentObject = toObject(segment);
    segmentsCollection.push(segmentObject);
  }
  console.log(segmentsCollection);
};
/**
 * Creates an array from ediData string containing every segment from edi-file as a seperate string
 * @param ediData stringified data from .edi input file
 */
const getSegments = (ediData: string): string[] => {
  const segmentDeliminator = "'";
  const segments = ediData.split(segmentDeliminator);
  // filter empty strings, if exist
  const filteredSegments = segments.filter((e) => e);
  return filteredSegments;
};

const getComposites = (segment: string): string[] => {
  const compositesDeliminator = "+";
  const composites = segment.split(compositesDeliminator);
  const filteredComposites = composites.filter((e) => e);
  return filteredComposites;
};

const getDataElements = (composite: string): string[] => {
  const dataElementsDeliminator = ":";
  const dataElements = composite.split(dataElementsDeliminator);
  const filteredDataElements = dataElements.filter((e) => e);
  return filteredDataElements;
};

const toObject = (segment: string) => {
  const composites = getComposites(segment);
  const segmentObject: SegmentObject = {
    name: "",
    composites: [],
    dataElements: [],
  };

  for (let i = 0; i < composites.length; i++) {
    segmentObject["name"] = composites[0].replace(/\r?\n|\r/g, "");
    segmentObject["composites"] = composites;
    segmentObject["dataElements"] = getDataElements(composites[i]);
  }

  return segmentObject;
};
