import Ember from 'ember';
import { BusPublisherMixin } from 'ember-message-bus';

const {
  Component
} = Ember;

export default Component.extend(BusPublisherMixin, {
  init() {
    this.publish('setValue', 1);

    this._super();
  }
});
