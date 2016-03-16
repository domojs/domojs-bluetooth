module.exports={
    get:function(callback)
    {
        callback($.map($.bt.devices, function(dev){
            return { uuid:dev.uuid, name:dev.advertisement.localName, rssi:dev.rssi, };
        }));
    },
    services:function(id, callback){
        var self=this;
        if($.bt.devices[id].services)
            return callback($.map($.bt.devices[id].services, function(svc){
                return { 
                    uuid:svc.uuid, 
                    name:svc.name, 
                    characteristics:$.map(svc.characteristics, function(characteristic){
                        return { 
                            uuid:characteristic.uuid, 
                            name:characteristic.name,
                            properties:characteristic.properties
                        };
                    }) 
                };
            }));

        $.bt.devices[id].once('servicesDiscover', function(){
            self.services(id, callback);
        });
        $.bt.devices[id].connect();
    },
    characteristics:function(id, serviceId, callback){
        if(!$.bt.devices[id] || $.bt.devices[id].services && !$.bt.devices[id].services[serviceId])
            return callback(404, 'unknown device or service');
            
        if($.bt.devices[id].services)
            return callback($.map($.bt.devices[id].services[serviceId].characteristics, function(characteristic){
                return { uuid:characteristic.uuid, name:characteristic.name };
            }));

        $.bt.devices[id].connect();
        
        callback(500, 'device not ready yet');
    }
};