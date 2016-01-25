var debug=$('debug')('jnode:noble:service:battery');

module.exports=function(device, cb){
    require('./base-service.js')(device, '180f', '2a19', {read:function(data, isNotification){
        debug('battery level is now: ', data.readUInt8(0) + '%');
        cb(data.readUInt8(0));
    }});
};