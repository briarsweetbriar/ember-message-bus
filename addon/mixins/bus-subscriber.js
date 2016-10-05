import Ember from 'ember';

const {
  Evented,
  Mixin,
  get
} = Ember;

const { inject: { service } } = Ember;

export default Mixin.create(Evented, {
  messageBus: service('message-bus'),

  willDestroyElement(...attrs) {
    this._super(...attrs);

    get(this, 'messageBus').unsubscribeAll(this);
  },

  willDestroy(...attrs) {
    this._super(...attrs);

    get(this, 'messageBus').unsubscribeAll(this);
  },

  subscribe(name, context, callback) {
    get(this, 'messageBus').subscribe(name, context, callback);
  },

  unsuscribe(name, context, callback) {
    get(this, 'messageBus').unsubscribe(name, context, callback);
  }
});
