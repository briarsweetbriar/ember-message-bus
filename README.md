[![npm version](https://badge.fury.io/js/ember-message-bus.svg)](https://badge.fury.io/js/ember-message-bus)
[![Build Status](https://travis-ci.org/null-null-null/ember-message-bus.svg?branch=master)](https://travis-ci.org/null-null-null/ember-message-bus)

# ember-message-bus

In many ways, Ember is an event driven framework, especially in the way that components communicate with each other. This does not extend to services, however, which must be tightly coupled to the components and other services that interface with them. With `ember-message-bus`, we can loosen that coupling by allowing those interactions to also be event driven.

## installation

`ember install ember-message-bus`

## usage

First, add the `BusPublisherMixin` to something (such as a component, route, or service):

```js
import Ember from 'ember';
import { BusPublisherMixin } from 'ember-message-bus';

export default Ember.Service.extend(BusPublisherMixin, {

});
```

Next, send messages to the message bus with `trigger`:

```js
export default Ember.Service.extend(BusPublisherMixin, {
  actions: {
    valueWasEntered(value) {
      this.trigger('userDidSubmitValue', value);
    }
  }
});
```

Finally, add the `BusSubscriberMixin` to anything that you want to listen for these messages:

```js
import Ember from 'ember';
import { BusSubscriberMixin } from 'ember-message-bus';

export default Ember.Service.extend(BusSubscriberMixin, {
  values: Ember.computed(() => Ember.A()),

  addValue: on('userDidSubmitValue', function(value) {
    this.get('values').pushObject(value);
  })
});
```
