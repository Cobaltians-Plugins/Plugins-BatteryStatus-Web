(function (cobalt) {
    var plugin = {
        name: 'batteryStatus',
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

            this.send('startStateMonitoring');
        },

        stopMonitoring: function () {
            this.send('stopStateMonitoring');
        },

        getLevel: function (callback) {
            this.send('getLevel', {}, function (data) {
                if (typeof callback == 'function')
                    callback(data.level);
                else
                    cobalt.log('Received battery level: ', data.level);
            });
        },

        getState: function (callback) {
            this.send('getState', {}, function (data) {
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
                    cobalt.log(this.name, ': unknown action ', json.action);
                    break;
            }
        },

        send: function (action, data, callback) {
            cobalt.send({ type: 'plugin', name: this.name, action: action, data: data }, callback);
        }
    };

    cobalt.plugins.register(plugin);
})(cobalt || {});
