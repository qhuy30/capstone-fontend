
var obj = {
  modeProduction:'development',
  port :{
      development:'3005',
      production:'3005'
  },
  hostname :{
      development:'0.0.0.0',
      production:'0.0.0.0'
  }
};
obj.port = obj.port[obj.modeProduction];
obj.hostname = obj.hostname[obj.modeProduction];
module.exports =obj;
