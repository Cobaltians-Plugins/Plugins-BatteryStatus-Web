(function (cobalt) {
    var plugin = {
        classes: {
			ios: "CobaltBatteryStatusPlugin",
            android: "io.kristal.batterystatusplugin.BatteryStatusPlugin"
        },
        defaultHandlers: {
            onStateChanged: function (state) {
                cobalt.log('Battery state changed: ' + state);
            }
        },
        state: {
            FULL: 'full',
            CHARGING: 'charging',
            DISCHARGING: 'discharging',
            LOW: 'low',
            UNKNOWN: 'unknown'
        },
        init: function () {
            cobalt.batteryStatus = {
                getLevel: this.getLevel.bind(this),
                getState: this.getState.bind(this),
                startMonitoring: this.startMonitoring.bind(this),
                stopMonitoring: this.stopMonitoring.bind(this),
                onStateChanged: this.defaultHandlers.onStateChanged,
                state: this.state
            };
        },
        startMonitoring: function (options) {
            if (options)
                this.defineCallbacks(options);

            cobalt.plugins.send(this, 'startStateMonitoring');
        },

        stopMonitoring: function () {
            cobalt.plugins.send(this, 'stopStateMonitoring');
        },

        getLevel: function (callback) {
            cobalt.plugins.send(this, 'getLevel', {}, function (data) {
                if (typeof callback == 'function')
                    callback(data.level);
                else
                    cobalt.log('Received battery level: ', data.level);
            });
        },

        getState: function (callback) {
            cobalt.plugins.send(this, 'getState', {}, function (data) {
                if (typeof callback == 'function')
                    callback(data.state);
                else
                    cobalt.log('Received battery state: ', data.state);
            });
        },

        handleEvent: function (json) {
            switch (json && json.action) {
                case 'onStateChanged':
                    if (typeof cobalt.batteryStatus.onStateChanged == 'function')
                        cobalt.batteryStatus.onStateChanged(json.data.state);
                    else
                        this.defaultHandlers.onStateChanged(json.data.state);
                    break;

                default:
                    cobalt.log('Battery plugin : unknown action ', json.action);
                    break;
            }
        }
    };

    cobalt.plugins.register(plugin);
})(cobalt || {});
