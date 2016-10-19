import Ember from 'ember';

const {
  Component,
  get
} = Ember;

const { inject: { service } } = Ember;

export default Component.extend({
  messageBus: service('message-bus'),

  didRender(...args) {
    this._super(...args);

    Ember.run.next(() => get(this, 'messageBus').publish('didSetValue', 1));
  }
});
