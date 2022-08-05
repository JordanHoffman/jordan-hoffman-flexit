import {v4 as uuidv4} from 'uuid';

import C from "./Constants"

function createDefaultDetailsObj() {
  return {
    isBaseBoard: false,
    flexDirection: 'row',
    size: { x: 1, y: 1 },
    justifyContent: "start",
    alignItems: "start",
    alignSelf: "default",
    initialChildDetailsArray: [],
    id: uuidv4()
  }
}

/**
 * Allows you to create a custom details object with whatever details you wish. Any left out details will just be default values.
 * @param {Object} details - The flexblock details you wish to set.
 */
function createDetailsObj(details) {
  let detailObj = createDefaultDetailsObj();

  for (const [key, value] of Object.entries(details)) {
    if (C.acceptedDetailKeys.includes(key)) {
      detailObj[key] = value;
    }
    else {
      throw new Error(`Attempted to add a detail to the flexblock with invalid key name: ${key}`)
    }
  }

  return detailObj;
}

const helperFunctions = {
  createDefaultDetailsObj : createDefaultDetailsObj,
  createDetailsObj : createDetailsObj
}

Object.freeze(helperFunctions);

export default helperFunctions;



