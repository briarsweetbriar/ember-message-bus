[![npm version](https://badge.fury.io/js/ember-message-bus.svg)](https://badge.fury.io/js/ember-message-bus)
[![Build Status](https://travis-ci.org/null-null-null/ember-message-bus.svg?branch=master)](https://travis-ci.org/null-null-null/ember-message-bus)

# ember-message-bus

While Ember's routes and components are highly event-driven, this pattern does not extend to services, which must be tightly coupled to the components and other services that interface with them. With `ember-message-bus`, we can loosen that coupling by allowing those interactions to also be event-driven.

## Installation

`ember install ember-message-bus`

## Usage

First, add the `BusPublisherMixin` to something (such as a component, route, or service):

```js
import Ember from 'ember';
import { BusPublisherMixin } from 'ember-message-bus';

export default Ember.Service.extend(BusPublisherMixin, {

});
```

Next, send messages to the message bus with `publish`:

```js
export default Ember.Service.extend(BusPublisherMixin, {
  init() {
    this.publish('serviceBooted', this);

    this._super();
  }
});
```

Finally, add the `BusSubscriberMixin` to anything that you want to listen for these messages:

```js
import Ember from 'ember';
import { BusSubscriberMixin } from 'ember-message-bus';

export default Ember.Service.extend(BusSubscriberMixin, {
  services: Ember.computed(() => Ember.A()),

  addService: on('serviceBooted', function(service) {
    this.get('services').pushObject(service);
  })
});
```
