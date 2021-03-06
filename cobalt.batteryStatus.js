(function(cobalt) {
  var plugin = {
    name: 'CobaltBatteryStatusPlugin',
    classes: {
      ios: "CobaltBatteryStatusPlugin",
      android: "io.kristal.batterystatusplugin.BatteryStatusPlugin"
    },
    defaultHandlers: {
      onStateChanged: function(state) {
        cobalt.log('Battery state changed: ' + state);
      },
      onStateReceived: function(state) {
        cobalt.log('Battery state received: ' + state);
      },
      onLevelReceived: function(level) {
        cobalt.log('Battery level received: ' + level);
      }
    },
    state: {
      FULL: 'full',
      CHARGING: 'charging',
      DISCHARGING: 'discharging',
      LOW: 'low',
      UNKNOWN: 'unknown'
    },
    init: function() {
      cobalt.batteryStatus = {
        getLevel: this.getLevel.bind(this),
        getState: this.getState.bind(this),
        startMonitoring: this.startMonitoring.bind(this),
        stopMonitoring: this.stopMonitoring.bind(this),
        onStateChanged: this.defaultHandlers.onStateChanged,
        onStateReceived: this.defaultHandlers.onStateReceived,
        onLevelReceived: this.defaultHandlers.onLevelReceived,
        state: this.state
      };
    },
    defineCallbacks: function(options) {
      if (options) {
        if (typeof options.onStateChanged === 'function') {
          cobalt.batteryStatus.onStateChanged = options.onStateChanged;
        }
        if (typeof options.onStateReceived === 'function') {
          cobalt.batteryStatus.onStateReceived = options.onStateReceived;
        }
        if (typeof options.onLevelReceived === 'function') {
          cobalt.batteryStatus.onLevelReceived = options.onLevelReceived;
        }
      }
    },
    startMonitoring: function(options) {
      this.defineCallbacks(options);
      cobalt.plugins.send(this, 'startStateMonitoring');
    },

    stopMonitoring: function() {
      cobalt.plugins.send(this, 'stopStateMonitoring');
    },

    getLevel: function(callback) {
      this.defineCallbacks({ onLevelReceived: callback });
      cobalt.plugins.send(this, 'getLevel', {}, cobalt.batteryStatus.onLevelReceived);
    },

    getState: function(callback) {
      this.defineCallbacks({ onStateReceived: callback });
      cobalt.plugins.send(this, 'getState', {}, cobalt.batteryStatus.onStateReceived);
    },
    handleEvent: function(event) {
      switch (event.action) {
        case 'onStateChanged':
          if (typeof cobalt.batteryStatus.onStateChanged === 'function'){
            cobalt.batteryStatus.onStateChanged(event.data);
          }
          break;
      }
    }
  };

  cobalt.plugins.register(plugin);
})(cobalt || {});
