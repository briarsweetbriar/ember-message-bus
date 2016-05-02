import Ember from 'ember';
import { BusSubscriberMixin } from 'ember-message-bus';

const {
  Component,
  on,
  set
} = Ember;

export default Component.extend(BusSubscriberMixin, {
  value: null,

  setValue: on('didSetValue', function(value) {
    set(this, 'value', value);
  })
});
