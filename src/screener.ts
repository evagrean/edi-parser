import { SegmentObject } from "./types.js";
/**
 * Creates an array of segmentObjects
 * @param ediData data from .edi input file in string format
 */
export const createSegmentsCollection = (ediData: string) => {
  const segmentsCollection: SegmentObject[] = [];
  const segments = getSegments(ediData);

  for (let segment of segments) {
    const segmentObject = toObject(segment);
    segmentsCollection.push(segmentObject);
  }

  return segmentsCollection;
};
/**
 * Creates an array from ediData string containing every segment from edi-file as a seperate string
 * @param ediData data from .edi input file in string format
 */
const getSegments = (ediData: string): string[] => {
  const segmentDeliminator = "'";
  const segments = ediData.split(segmentDeliminator);
  // filter empty strings, if exist
  const filteredSegments = segments.filter((e) => e);
  return filteredSegments;
};
/**
 * Creates an array from segment data containing the composites of a single segment
 * @param segment string of entire segment
 */
const getComposites = (segment: string): string[] => {
  const compositesDeliminator = "+";
  const composites = segment.split(compositesDeliminator);
  const filteredComposites = composites.filter((e) => e);
  return filteredComposites;
};

/**
 * Creates an array of data elements out of the composites. Doesn't work properly at the Moment when there is more than 1 composite to split
 * @param composite composite of segment
 */
const getDataElements = (composite: string): string[] => {
  const dataElementsDeliminator = ":";

  const dataElements = composite.split(dataElementsDeliminator);
  const filteredDataElements = dataElements.filter((e) => e);

  return filteredDataElements;
};
/**
 * Makes an Object out of segment data so it can be then accessed for parsing
 * @param segment segment of edi data in string format
 */
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
