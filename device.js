deviceTypes.bluetooth={
    name:'bluetooth',
    onChange:function(){
        if(!deviceTypes.bluetooth || !deviceTypes.bluetooth.devices)
        {
            $.getJSON('/api/bluetooth', function(devices){ 
                deviceTypes.bluetooth.devices=devices; 
                $('#commands').empty(); 
                deviceTypes.bluetooth.onChange(); 
            });
        }
        var device=$('<li class="form-group">')
            .append('<label class="col-sm-2 control-label" for="blaster">Device</label>')
            .append('<div class="col-sm-10"><select class="commandsUrl form-control" placeholder="Url" id="uuid" name="uuid"></select></div>')
            .appendTo('#commands');
        if(deviceTypes.bluetooth.devices)
            $.each(deviceTypes.bluetooth.devices, function(index,item){
                device.find('select').append('<option value="'+item.uuid+'">'+item.name+'</option>');
            });
        return 'dynamic';
    },
    onAdd:function(){
    }, 
    onSave:function(data){
        data.append('uuid', $('#uuid').val());
    },
    onServerSave:function(device, body){
        var discover=function(){
            console.log('discovering');
            device.handler={
                battery:function(data)
                {
                    console.log(data);
                },
            };
            $('./modules/bluetooth/services')($.bt.devices[body.uuid], device.handler, function(){
                if(device.handler.sendImmediateAlert)
                {
                    device.commands.sendLowAlert=function(cb){
                        device.handler.sendImmediateAlert(new Buffer([0x00]), cb);
                    };
                    device.commands.sendNormalAlert=function(cb){
                        device.handler.sendImmediateAlert(new Buffer([0x01]), cb);
                    };
                    device.commands.sendHighAlert=function(cb){
                        device.handler.sendImmediateAlert(new Buffer([0x02]), cb);
                    };
                }
            });
            $.bt.devices[body.uuid].on('update', function(){
                device.emit('status', $.bt.devices[body.uuid].rssi);
            })
            $.bt.devices[body.uuid].on('disconnect', function(){
                if($.bt.devices[body.uuid].resolved)
                {
                    $.bt.devices[body.uuid].removeListener('disconnect', arguments.callee);
                    return;
                }
                else
                    console.log($.bt.devices[body.uuid].resolved);
                discover();
            })
            $.bt.devices[body.uuid].connect(function(){
                device.commands={};
                $.bt.devices[body.uuid].discoverServices([], function(error, services) {
                    if(!$.bt.devices[body.uuid].services);
                        $.bt.devices[body.uuid].services={};
                    $.each(services, function(i, service){
                        if(service.resolved)
                            return;
                        $.bt.devices[body.uuid].services[service.uuid]=service;
                        service.discoverCharacteristics([], function(error, characteristics) {
                            service.resolved=true;
                            if($.grep(services, function(svc){
                                return !svc.resolved;
                            }).length==0)
                                $.bt.devices[body.uuid].resolved=true;
                            service.characteristics={};
                            $.each(characteristics, function(i, characteristic){
                                service.characteristics[characteristic.uuid]=characteristic;
                            });
                        });
                    });
                });
            });
        };
        device.status=function(callback){
            callback($.bt.devices[body.uuid].rssi);
        };
        device.statusMethod='push';
        if(!$.bt.devices[body.uuid])
        {
            $.bt.noble.on('discover', function(btDevice){
                if(btDevice.uuid==body.uuid)
                {
                    $.bt.noble.removeListener('discover', arguments.callee);
                    discover();
                }
            });
        }
        else
            discover();
    }
};  