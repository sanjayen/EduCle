// picoExtension.js
// Shane M. Clements, February 2014
// PicoBoard Scratch Extension
//
// This is an extension for development and testing of the Scratch Javascript Extension API.

(function(ext) {
    var device = null;
    var rawData = null;

    // Sensor states:
    var channels = {
        slider: 7,
        light: 5,
        sound: 6,
        button: 3,
        'resistance-A': 4,
        'resistance-B': 2,
        'resistance-C': 1,
        'resistance-D': 0
    };
    var inputs = {
        slider: 0,
        light: 0,
        sound: 0,
        button: 0,
        'resistance-A': 0,
        'resistance-B': 0,
        'resistance-C': 0,
        'resistance-D': 0
    };

    ext.resetAll = function(){};

    // Hats / triggers
    ext.whenSensorConnected = function(which) {
        return getSensorPressed(which);
    };

    ext.whenSensorPass = function(which, sign, level) {
        if (sign == '<') return getSensor(which) < level;
        return getSensor(which) > level;
    };

    // Reporters
    ext.sensorPressed = function(which) {
        return getSensorPressed(which);
    };

    ext.sensor = function(which) { return getSensor(which); };

    // Private logic
    function getSensorPressed(which) {
        if (device == null) return false;
        if (which == 'button pressed' && getSensor('button') < 1) return true;
        if (which == 'A connected' && getSensor('resistance-A') < 10) return true;
        if (which == 'B connected' && getSensor('resistance-B') < 10) return true;
        if (which == 'C connected' && getSensor('resistance-C') < 10) return true;
        if (which == 'D connected' && getSensor('resistance-D') < 10) return true;
        return false;
    }

    function getSensor(which) {
        return inputs[which];
    }

    var inputArray = [];
    function processData() {
        var bytes = new Uint8Array(rawData);

        inputArray[15] = 0;

        // TODO: make this robust against misaligned packets.
        // Right now there's no guarantee that our 18 bytes start at the beginning of a message.
        // Maybe we should treat the data as a stream of 2-byte packets instead of 18-byte packets.
        // That way we could just check the high bit of each byte to verify that we're aligned.
        for(var i=0; i<9; ++i) {
            var hb = bytes[i*2] & 127;
            var channel = hb >> 3;
            var lb = bytes[i*2+1] & 127;
            inputArray[channel] = ((hb & 7) << 7) + lb;
        }

        if (watchdog && (inputArray[15] == 0x04)) {
            // Seems to be a valid PicoBoard.
            clearTimeout(watchdog);
            watchdog = null;
        }

        for(var name in inputs) {
            var v = inputArray[channels[name]];
            if(name == 'light') {
                v = (v < 25) ? 100 - v : Math.round((1023 - v) * (75 / 998));
            }
            else if(name == 'sound') {
                //empirically tested noise sensor floor
                v = Math.max(0, v - 18)
                v =  (v < 50) ? v / 2 :
                    //noise ceiling
                    25 + Math.min(75, Math.round((v - 50) * (75 / 580)));
            }
            else {
                v = (100 * v) / 1023;
            }

            inputs[name] = v;
        }

        //console.log(inputs);
        rawData = null;
    }

    function appendBuffer( buffer1, buffer2 ) {
        var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
        tmp.set( new Uint8Array( buffer1 ), 0 );
        tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
        return tmp.buffer;
    }

    // Extension API interactions
    var potentialDevices = [];
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);

        if (!device) {
            tryNextDevice();
        }
    }

    function tryNextDevice() {
        // If potentialDevices is empty, device will be undefined.
        // That will get us back here next time a device is connected.
        device = potentialDevices.shift();

        if (device) {
            device.open({ stopBits: 0, bitRate: 38400, ctsFlowControl: 0 }, deviceOpened);
        }
    }

    var poller = null;
    var watchdog = null;
    function deviceOpened(dev) {
        if (!dev) {
            // Opening the port failed.
            tryNextDevice();
            return;
        }
        device.set_receive_handler(function(data) {
            //console.log('Received: ' + data.byteLength);
            if(!rawData || rawData.byteLength == 18) rawData = new Uint8Array(data);
            else rawData = appendBuffer(rawData, data);

            if(rawData.byteLength >= 18) {
                //console.log(rawData);
                processData();
                //device.send(pingCmd.buffer);
            }
        });

        // Tell the PicoBoard to send a input data every 50ms
        var pingCmd = new Uint8Array(1);
        pingCmd[0] = 1;
        poller = setInterval(function() {
            device.send(pingCmd.buffer);
        }, 50);
        watchdog = setTimeout(function() {
            // This device didn't get good data in time, so give up on it. Clean up and then move on.
            // If we get good data then we'll terminate this watchdog.
            clearInterval(poller);
            poller = null;
            device.set_receive_handler(null);
            device.close();
            device = null;
            tryNextDevice();
        }, 250);
    };

    ext._deviceRemoved = function(dev) {
        if(device != dev) return;
        if(poller) poller = clearInterval(poller);
        device = null;
    };

    ext._shutdown = function() {
        if(device) device.close();
        if(poller) poller = clearInterval(poller);
        device = null;
    };

    ext._getStatus = function() {
        if(!device) return {status: 1, msg: 'PicoBoard disconnected'};
        if(watchdog) return {status: 1, msg: 'Probing for PicoBoard'};
        return {status: 2, msg: 'PicoBoard connected'};
    }

    var descriptor = {
        blocks: [
            ['h', 'when %m.booleanSensor',         'whenSensorConnected', 'button pressed'],
            ['h', 'when %m.sensor %m.lessMore %n', 'whenSensorPass',      'slider', '>', 50],
            ['b', 'sensor %m.booleanSensor?',      'sensorPressed',       'button pressed'],
            ['r', '%m.sensor sensor value',        'sensor',              'slider']
        ],
        menus: {
            booleanSensor: ['button pressed', 'A connected', 'B connected', 'C connected', 'D connected'],
            sensor: ['slider', 'light', 'sound', 'resistance-A', 'resistance-B', 'resistance-C', 'resistance-D'],
            lessMore: ['>', '<']
        },
        url: '/info/help/studio/tips/ext/PicoBoard/'
    };
    ScratchExtensions.register('PicoBoard', descriptor, ext, {type: 'serial'});
})({});
