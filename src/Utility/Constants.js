const Constants = {
  acceptedDetailKeys : ['isBaseBoard', 'flexDirection', 'size', 'justifyContent', 'alignItems', 'alignSelf', 'initialChildDetailsArray'],
  layers: [0,1,2,3,4,5,6,7,8],
  justifyContent: ['start', 'center', 'end', 'between', 'around', 'evenly'],
  alignContent: ['start', 'center', 'end'],
  alignSelf: ['default', 'start', 'center', 'end'],
  flexFail: Object.freeze({
    Room: 'Room',
    Overlap: 'Overlap',
    Confirm: 'Confirm'
  })
}

Object.freeze(Constants);

export default Constants;