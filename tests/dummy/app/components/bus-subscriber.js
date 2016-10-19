import Ember from 'ember';

const {
  Component,
  get,
  set
} = Ember;

const { inject: { service } } = Ember;

export default Component.extend({
  value: null,

  messageBus: service('message-bus'),

  init(...args) {
    this._super(...args);

    get(this, 'messageBus').subscribe('didSetValue', this, this.setValue);
  },

  setValue(value) {
    set(this, 'value', value);
  }
});
