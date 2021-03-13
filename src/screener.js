export var getSegmentObjects = function (ediData) {
    var segmentsCollection = [];
    var segments = getSegments(ediData);
    for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
        var segment = segments_1[_i];
        var segmentObject = toObject(segment);
        segmentsCollection.push(segmentObject);
    }
    return segmentsCollection;
};
/**
 * Creates an array from ediData string containing every segment from edi-file as a seperate string
 * @param ediData stringified data from .edi input file
 */
var getSegments = function (ediData) {
    var segmentDeliminator = "'";
    var segments = ediData.split(segmentDeliminator);
    // filter empty strings, if exist
    var filteredSegments = segments.filter(function (e) { return e; });
    return filteredSegments;
};
var getComposites = function (segment) {
    var compositesDeliminator = "+";
    var composites = segment.split(compositesDeliminator);
    var filteredComposites = composites.filter(function (e) { return e; });
    return filteredComposites;
};
var getDataElements = function (composite) {
    var dataElementsDeliminator = ":";
    var dataElements = composite.split(dataElementsDeliminator);
    var filteredDataElements = dataElements.filter(function (e) { return e; });
    return filteredDataElements;
};
var toObject = function (segment) {
    var composites = getComposites(segment);
    var segmentObject = {
        name: "",
        composites: [],
        dataElements: [],
    };
    for (var i = 0; i < composites.length; i++) {
        segmentObject["name"] = composites[0].replace(/\r?\n|\r/g, "");
        segmentObject["composites"] = composites;
        segmentObject["dataElements"] = getDataElements(composites[i]);
    }
    return segmentObject;
};
