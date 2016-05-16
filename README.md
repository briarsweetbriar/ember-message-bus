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

  addService: Ember.on('serviceBooted', function(service) {
    this.get('services').pushObject(service);
  })
});
```

### Testing

It's easy to test if a message is published. First, run `initializeQUnitAssertions`:

```js
import { initializeQUnitAssertions } from 'ember-message-bus';

moduleForComponent('my-component', 'Integration | Component | my component', {
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeQUnitAssertions(appInstance);
  }
});
```

If you'd like to ensure that events are published, use the Qunit assertion `willPublish` like so:

```js
assert.willPublish('shouldBeTriggered', '`shouldBeTriggered` was triggered');
assert.willPublish('shouldReceiveArgs', ['foo', arg2], '`shouldReceiveArgs` received the correct args');
assert.willPublish('shouldCallback', (param1, param2) => return param2 === arg2, '`shouldCallback` tested with callback');
```

Note that if you want to test that args are published, the expected args should be passed in as an array. Alternatively, you can provide a callback that will receive the args as their params.

On the other end, if you want to confirm that a message was not published, you can use `willNotPublish`:

```js
assert.willNotPublish('thisMessageShouldNotBePublished', '`thisMessageShouldNotBePublished` was not published');
```

Note that in both cases, these assertions should be made _before_ the message is actually published. So in a component integration test:

```js
const foo = { bar: 'baz' };

this.set('foo', foo);

assert.willPublish('shouldBeTriggered', [foo], '`shouldBeTriggered` was triggered');

this.render(hbs`{{my-component foo=foo}}`);
```
