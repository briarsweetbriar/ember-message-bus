import Ember from 'ember';

const {
  Evented,
  Mixin,
  get,
  on
} = Ember;

const { inject: { service } } = Ember;

export default Mixin.create(Evented, {
  messageBus: service('message-bus'),

  init() {
    get(this, 'messageBus').register(this);

    this._super();
  },

  unregisterWithBus: on('willDestroy', 'willDestroyElement', function() {
    get(this, 'messageBus').unregister(this);
  })
});
