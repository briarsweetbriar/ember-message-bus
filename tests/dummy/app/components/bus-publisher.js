import Ember from 'ember';
import { BusPublisherMixin } from 'ember-message-bus';

const {
  Component,
  on
} = Ember;

export default Component.extend(BusPublisherMixin, {
  setValue: on('init', function() {
    this.publish('setValue', 1);
  })
});
