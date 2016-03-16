var debug=$('debug')('jnode:noble:service:immediate-alert');

module.exports=function(device, cb){
    require('./base-service.js')(device, '1802', '2a06', {writeWithoutResponse:cb});
}; 