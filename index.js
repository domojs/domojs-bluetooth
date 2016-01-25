
var noble=require('noble');

require('jnode/setup.js');

var debug=$('debug')('jnode:noble:core');
$.bt={noble:noble, devices:{}};

var serviceMapping={
    '1811':'Alert Notification Service',
    '1815':'Automation IO',
    '180f':'./services/battery.js',
    '1810':'Blood Pressure',
    '181B':'Body Composition',
    '181E':'Bond Management',
    '181F':'Continuous Glucose Monitoring',
    '1805':'Current Time Service',
    '1818':'Cycling Power',
    '1816':'Cycling Speed and Cadence',
    '180A':'Device Information',
    '181A':'Environmental Sensing',
    '1800':'Generic Access',
    '1801':'Generic Attribute',
    '1808':'Glucose',
    '1809':'Health Thermometer',
    '180D':'Heart Rate',
    '1812':'Human Interface Device',
    '1802':'Immediate Alet',
    '1821':'Indoor Positioning',
    '1820':'Internet Protocol Support',
    '1803':'Link Loss',
    '1819':':Location and Navigation',
    '1807':'Next DST Change Service',
    '180E':'Phone Alert Status Service',
    '1822':'Pulse Oximeter',
    '1806':'Reference Time Update Service',
    '1814':'Running Speed and Cadence',
    '1813':'Scan Parameters',
    '1804':'Tx Power',
    '181C':'User Data',
    '181D':'Weight Scale',
};

var characteristicsMapping={
    '2A7E':'Aerobic Heart Rate Lower Limit',
    '2A84':'Aerobic Heart Rate Upper Limit',
    '2A7F':'Aerobic Threshold',
    '2A80':'Age',
    '2A5A':'Aggregate',
    '2A43':'Alert Category ID',
    '2A42':'Alert Category ID Bit Mask',
    '2A06':'Alert Level',
    '2A44':'Alert Notification Control Point',
    '2A3F':'Alert Status',
    '2AB3':'Altitude',
    '2A81':'Anaerobic Heart Rate Lower Limit',
    '2A82':'Anaerobic Heart Rate Upper Limit',
    '2A83':'Anaerobic Threshold',
    '2A58':'Analog',
    '2A73':'Apparent Wind Direction',
    '2A72':'Apparent Wind Speed',
    '2A01':'Appearance',
    '2AA3':'Barometric Pressure Trend',
    '2A19':'Battery Level',
    '2A49':'Blood Pressure Feature',
    '2A35':'Blood Pressure Measurement',
    '2A9B':'Body Composition Feature',
    '2A9C':'Body Composition Measurement',
    '2A38':'Body Sensor Location',
    '2AA4':'Bond Management Control Point',
    '2AA5':'Bond Management Feature',
    '2A22':'Boot Keyboard Input Report',
    '2A32':'Boot Keyboard Output Report',
    '2A33':'Boot Mouse Input Report',
    '2AA6':'Central Address Resolution',
    '2AA8':'CGM Feature',
    '2AA7':'CGM Measurement',
    '2AAB':'CGM Session Run Time',
    '2AAA':'CGM Session Start Time',
    '2AAC':'CGM Specific Ops Control Point',
    '2AA9':'CGM Status',
    '2A5C':'CSC Feature',
    '2A5B':'CSC Measurement',
    '2A2B':'Current Time',
    '2A66':'Cycling Power Control Point',
    '2A65':'Cycling Power Feature',
    '2A63':'Cycling Power Measurement',
    '2A64':'Cycling Power Vector',
    '2A99':'Database Change Increment',
    '2A85':'Date of Birth',
    '2A86':'Date of Threshold Assessment',
    '2A08':'Date Time',
    '2A0A':'Day Date Time',
    '2A09':'Day of Week',
    '2A7D':'Descriptor Value Changed',
    '2A00':'Device Name',
    '2A7B':'Dew Point',
    '2A56':'Digital',
    '2A0D':'DST Offset',
    '2A6C':'Elevation',
    '2A87':'Email Address',
    '2A0C':'Exact Time 256',
    '2A88':'Fat Burn Heart Rate Lower Limit',
    '2A89':'Fat Burn Heart Rate Upper Limit',
    '2A26':'Firmware Revision String',
    '2A8A':'First Name',
    '2A8B':'Five Zone Heart Rate Limits',
    '2AB2':'Floor Number',
    '2A8C':'Gender',
    '2A51':'Glucose Feature',
    '2A18':'Glucose Measurement',
    '2A34':'Glucose Measurement Context',
    '2A74':'Gust Factor',
    '2A27':'Hardware Revision String',
    '2A39':'Heart Rate Control Point',
    '2A8D':'Heart Rate Max',
    '2A37':'Heart Rate Measurement',
    '2A7A':'Heat Index',
    '2A8E':'Height',
    '2A4C':'HID Control Point',
    '2A4A':'HID Information',
    '2A8F':'Hip Circumference',
    '2A6F':'Humidity',
    '2A2A':'IEEE 11073-20601 Regulatory Certification Data List',
    '2AAD':'Indoor Positioning Configuration',
    '2A36':'Intermediate Cuff Pressure',
    '2A1E':'Intermediate Temperature',
    '2A77':'Irradiance',
    '2AA2':'Language',
    '2A90':'Last Name',
    '2AAE':'Latitude',
    '2A6B':'LN Control Point',
    '2A6A':'LN Feature',
    '2AB1':'Local East Coordinate',
    '2AB0':'Local North Coordinate',
    '2A0F':'Local Time Information',
    '2A67':'Location and Speed',
    '2AB5':'Location Name',
    '2AAF':'Longitude',
    '2A2C':'Magnetic Declination',
    '2AA0':'Magnetic Flux Density - 2D',
    '2AA1':'Magnetic Flux Density - 3D',
    '2A29':'Manufacturer Name String',
    '2A91':'Maximum Recommended Heart Rate',
    '2A21':'Measurement Interval',
    '2A24':'Model Number String',
    '2A68':'Navigation',
    '2A46':'New Alert',
    '2A04':'Peripheral Preferred Connection Parameters',
    '2A02':'Peripheral Privacy Flag',
    '2A5F':'PLX Continuous Measurement',
    '2A60':'PLX Features',
    '2A5E':'PLX Spot-Check Measurement',
    '2A50':'PnP ID',
    '2A75':'Pollen Concentration',
    '2A69':'Position Quality',
    '2A6D':'Pressure',
    '2A4E':'Protocol Mode',
    '2A78':'Rainfall',
    '2A03':'Reconnection Address',
    '2A52':'Record Access Control Point',
    '2A14':'Reference Time Information',
    '2A4D':'Report',
    '2A4B':'Report Map',
    '2A92':'Resting Heart Rate',
    '2A40':'Ringer Control Point',
    '2A41':'Ringer Setting',
    '2A54':'RSC Feature',
    '2A53':'RSC Measurement',
    '2A55':'SC Control Point',
    '2A4F':'Scan Interval Window',
    '2A31':'Scan Refresh',
    '2A5D':'Sensor Location',
    '2A25':'Serial Number String',
    '2A05':'Service Changed',
    '2A28':'Software Revision String',
    '2A93':'Sport Type for Aerobic and Anaerobic Thresholds',
    '2A47':'Supported New Alert Category',
    '2A48':'Supported Unread Alert Category',
    '2A23':'System ID',
    '2A6E':'Temperature',
    '2A1C':'Temperature Measurement',
    '2A1D':'Temperature Type',
    '2A94':'Three Zone Heart Rate Limits',
    '2A12':'Time Accuracy',
    '2A13':'Time Source',
    '2A16':'Time Update Control Point',
    '2A17':'Time Update State',
    '2A11':'Time with DST',
    '2A0E':'Time Zone',
    '2A71':'True Wind Direction',
    '2A70':'True Wind Speed',
    '2A95':'Two Zone Heart Rate Limit',
    '2A07':'Tx Power Level',
    '2AB4':'Uncertainty',
    '2A45':'Unread Alert Status',
    '2A9F':'User Control Point',
    '2A9A':'User Index',
    '2A76':'UV Index',
    '2A96':'VO2 Max',
    '2A97':'Waist Circumference',
    '2A98':'Weight',
    '2A9D':'Weight Measurement',
    '2A9E':'Weight Scale Feature',
    '2A79':'Wind Chill',
};

noble.on('stateChange', function(state) {
  console.log(state);
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

var connectedPeripherals=[];

noble.on('discover', function(peripheral) {
    
    //debug('peripheral discovered (' + peripheral.uuid +
    //          ' with address <' + peripheral.address +  ', ' + peripheral.addressType + '>, RSSI ' + peripheral.rssi + ':');
    
    //var notified=false;
    if(!$.bt.devices[peripheral.uuid])
    {
        peripheral.on('connect', function(){
        console.log('connected to device '+peripheral.uuid);
            peripheral.connected=true;
            connectedPeripherals.push(peripheral);
        });
        
        peripheral.on('disconnect', function(){
            console.log('disconnected from device '+peripheral.uuid);
            peripheral.connected=false;
            connectedPeripherals.splice(connectedPeripherals.indexOf(peripheral), 1);
            /*if(!notified)
                peripheral.connect(function(){
                    noble.write(peripheral.uuid, '1803', '2a06', new Buffer([0x01]), true);
                });*/
            if(connectedPeripherals.length==0)
                noble.startScanning([], true);
        });
    }
    else
        peripheral.emit('update');

    $.bt.devices[peripheral.uuid]=peripheral;
    
    /*console.log('peripheral discovered (' + peripheral.uuid +
              ' with address <' + peripheral.address +  ', ' + peripheral.addressType + '>, RSSI ' + peripheral.rssi + ':');
    console.log('\thello my local name is:');
    console.log('\t\t' + peripheral.advertisement.localName);
    console.log('\tcan I interest you in any of the following advertised services:');
    console.log('\t\t' + JSON.stringify($.map(peripheral.advertisement.serviceUuids, function(v){ return serviceMapping[v]; })));
    var serviceData = peripheral.advertisement.serviceData;
    if (serviceData && serviceData.length) {
    console.log('\there is my service data:');
    for (var i in serviceData) {
      console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
    }
    }*/
    
    //console.log(peripheral.advertisement);
    /*if (peripheral.advertisement.manufacturerData) {
        console.log('\there is my manufacturer data:');
        console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
    }
    if (peripheral.advertisement.txPowerLevel !== undefined) {
        console.log('\tmy TX power level is:');
        console.log('\t\t' + peripheral.advertisement.txPowerLevel);
    }*/
    
    /*peripheral.on('rssiUpdate', function(rssi)
    {
        console.log('RSSI for '+peripheral.advertisement.localName+' ('+peripheral.address+') : '+rssi);
    });
    
    peripheral.connect(function(error){
        if(error)
        {
            console.log(error);
            return;
        }
                
        peripheral.discoverServices([], function(error, services) {
          $.each(services, function(i, service){
              
          console.log('discovered '+service.name);
    
          service.discoverCharacteristics([], function(error, characteristics) {
              $.each(characteristics, function(i, characteristic){
                  
                    console.log('discovered characteristic ('+ characteristic.properties.join(', ') +')'+ characteristic.name+' for '+service.name);
                    
                    if(service.uuid=='1803' && characteristic.uuid=='2a06')
                    {
                        console.log('notifying peripheral');
                        var data=new Buffer(4);
                        data.writeUInt8(1, 0);
                        characteristic.write(data, true);
                        characteristic.on('data', function(data, isNotification){
                            console.log(arguments);
                        });
                        characteristic.notify(true, function(){
                            console.log(arguments);
                        });
                    }
            
                    /*if(service.uuid=='1802' && characteristic.uuid=='2a06')
                    {
                        console.log('notifying peripheral');
                        var data=new Buffer(4);
                        data.writeUInt8(1, 0);
                        characteristic.write(data, true);
                    }
            
                    
                    if(characteristic.uuid=='2a19')
                    {
                        characteristic.on('data', function(data, isNotification) {
                          console.log('battery level is now: ', data.readUInt8(0) + '%');
                        });
                
                        // true to enable notify
                        characteristic.notify(true, function(error) {
                          console.log('battery level notification on');
                        });
                    }*//*
              })
          })
          });
        });            
    })*/
});

process.on('exit', function(){
    noble.stopScanning();
    
    $.each(connectedPeripherals, function(i, peripheral){
        peripheral.disconnect();
    });
});