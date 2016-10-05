import Ember from 'ember';
import { BusPublisherMixin } from 'ember-message-bus';

const {
  Component
} = Ember;

export default Component.extend(BusPublisherMixin, {
  didRender(...args) {
    this._super(...args);

    Ember.run.next(() => this.publish('didSetValue', 1));
  }
});
