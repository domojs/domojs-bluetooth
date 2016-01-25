var debug=$('debug')('jnode:noble:service:base');

module.exports=function(device, svcUuid, characUuid, handlers, needsRediscover)
{
    if(device.previouslyDiscovered && !needsRediscover)
        return;
    /*if(device.advertisement.serviceUuids.indexOf(svcUuid)==-1)
        return;*/
    device.once('servicesDiscover', function(services){
        var matchingSvc=$.grep(services, function(svc){
            return svc.uuid==svcUuid;
        });
        if(matchingSvc.length==1)
        {
            debug('matching service found: '+matchingSvc[0].name);
            matchingSvc[0].once('characteristicsDiscover', function(characteristics)
            {
                var matchingCharac=$.grep(characteristics, function(characteristic){
                    return characteristic.uuid==characUuid;
                });
                if(matchingCharac.length==1)
                {
                    debug('matching characteristic found: '+matchingCharac[0].name);
                    debug(matchingCharac[0].properties);
                    
                    if(matchingCharac[0].properties.indexOf('read')>-1 && handlers.read)
                    {
                        debug('binding on read');
                        matchingCharac[0].on('data', handlers.read);
                        if(handlers.readNow)
                            matchingCharac[0].read($.noop);
                    }

                    if(matchingCharac[0].properties.indexOf('write')>-1 && handlers.write)
                        handlers.write(function(data, cb){
                            if(!device.connected)
                                device.connect(function(){
                                    console.log('connecting because of write');
                                    matchingCharac[0].write(data, true, cb);
                                    complete(200);
                                });
                            else
                            {
                                matchingCharac[0].write(data, true, cb);
                                complete(200);
                            }
                        });

                    if(matchingCharac[0].properties.indexOf('writeWithoutResponse')>-1 && handlers.writeWithoutResponse)
                    {
                        debug('updating');
                        handlers.writeWithoutResponse(function(data, complete){
                            device.once('write', function(error){
                                debug('callback');
                                debug(error);
                                if(error)
                                    complete(500, error);
                                else
                                    complete(200);
                            });
                            if(!device.connected)
                                device.connect(function(){
                                    debug('writing to '+matchingCharac[0].name);
                                    debug(data);
                                    device.writeHandle(matchingCarac[0].valueHandle, data, true);
                                });
                            else
                            {
                                debug('writing to '+matchingCharac[0].name);
                                debug(data);
                                device.writeHandle(matchingCarac[0].valueHandle, data, true);
                            }
                        });
                    }

                    if(matchingCharac[0].properties.indexOf('notify')>-1 && handlers.notify && handlers.read)
                    {
                        debug('binding on notify');
                        
                        device.on('disconnect', function(){
                            device.connect(function(){
                                console.log('connecting because of notify');
                                device.discoverServices([svcUuid], function(error, svcs){
                                    matchingSvcs=svcs;
                                    svcs[0].discoverCharacteristics([characUuid], function(error, charac){
                                        matchingCharac=charac;
                                      matchingCharac[0].on('data', handlers.read);
                                      matchingCharac[0].notify(true, function(error){
                                            if(error)
                                                console.error(error);
                                            if($.isFunction(handlers.notify))
                                                handlers.notify(error);
                                        });
                                    });
                                })
                            })
                        });
                        if(device.connected)
                            matchingCharac[0].notify(true, function(error){
                                if(error)
                                    console.error(error);
                                if($.isFunction(handlers.notify))
                                    handlers.notify(error);
                                debug(arguments);
                            });
                    }
                }
            });
        }
    });
} 