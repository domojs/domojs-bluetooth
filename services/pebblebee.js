var debug=$('debug')('jnode:noble:beacon:pebblebee');

var notified={};

var knownDevices={};

module.exports=function(device, cb){
    if(typeof(knownDevices[device.uuid])=='undefined')
    {
        require('./base-service.js')(device, '180a', '2a29', {read:function(data){
            console.log(data.toString('ascii'));
            if(knownDevices[device.uuid]=(data=='Cambridge Silicon Radio'))
                device.on('update', function(){
                    //console.log('reading button state');
                    var buttonPress=device.advertisement.manufacturerData[device.advertisement.manufacturerData.length-1];
                    if(buttonPress && !notified[device.uuid])
                    {
                        notified[device.uuid]=true;
                        console.log('button pressed');
                        cb();
                    }
                    else if(!buttonPress && notified[device.uuid])
                    {
                        delete notified[device.uuid];
                        console.log('button released');
                    }
                });
            device.disconnect();
        }, readNow:true});
    }
    else if(knownDevices[device.uuid])
    {
    }
}; 