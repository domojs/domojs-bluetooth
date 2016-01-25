$.bt.knownDevices={};

module.exports=function(device, handler, updated)
{
    if(typeof($.bt.knownDevices[device.uuid])!='undefined')
        device.previouslyDiscovered=$.bt.knownDevices[device.uuid];
    $.bt.knownDevices[device.uuid]=true;
    //require('./battery.js')(device, handler.battery);
    //require('./pebblebee.js')(device, handler.battery);
    /*require('./immediate-alert.js')(device, function(writter){
        handler.sendImmediateAlert=writter;
        if(updated)
            updated();
    });*/
};