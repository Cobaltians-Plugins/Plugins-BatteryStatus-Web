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
      if (options)
        this.defineCallbacks(options);

      cobalt.plugins.send(this, 'startStateMonitoring');
    },

    stopMonitoring: function() {
      cobalt.plugins.send(this, 'stopStateMonitoring');
    },

    getLevel: function(callback) {
      if (callback){
        cobalt.batteryStatus.onLevelReceived = callback;
      }
      cobalt.plugins.send(this, 'getLevel', {});
    },

    getState: function(callback) {
      if (callback) {
        cobalt.batteryStatus.onStateReceived = callback;
      }
      cobalt.plugins.send(this, 'getState', {});
    },

    handleEvent: function(json) {
      switch (json && json.data && json.data.action) {
        case 'onStateChanged':
          if (typeof cobalt.batteryStatus.onStateChanged === 'function'){
            cobalt.batteryStatus.onStateChanged(json.data.state);
          }
          break;
        case 'onState':
          if (typeof cobalt.batteryStatus.onStateReceived === 'function') {
            cobalt.batteryStatus.onStateReceived(json.data.state);
          }
          break;
        case 'onLevel':
          if (typeof cobalt.batteryStatus.onLevelReceived === 'function') {
            cobalt.batteryStatus.onLevelReceived(json.data.level);
          }
          break;
      }
    }
  };

  cobalt.plugins.register(plugin);
})(cobalt || {});
