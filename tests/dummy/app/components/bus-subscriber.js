import Ember from 'ember';
import { BusSubscriberMixin } from 'ember-message-bus';

const {
  Component,
  set
} = Ember;

export default Component.extend(BusSubscriberMixin, {
  value: null,

  init(...args) {
    this._super(...args);

    this.subscribe('setValue', this, (value) => {
      set(this, 'value', value);
    });
  }
});
