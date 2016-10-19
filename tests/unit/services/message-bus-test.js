import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:message-bus', 'Unit | Service | message bus', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('`publish` calls the `callback` on all subscribers', function(assert) {
  assert.expect(2);

  const service = this.subject();

  const object = Ember.Component.create({
    callFoo(...messages) {
      assert.deepEqual(messages, ['bar', 'baz'], 'messages are passed through to object');
    }
  });

  const object2 = Ember.Component.create({
    callFoo(...messages) {
      assert.deepEqual(messages, ['bar', 'baz'], 'messages are passed through to object2');
    }
  });

  service.subscribe('foo', object, object.callFoo);
  service.subscribe('foo', object2, object2.callFoo);

  service.publish('foo', 'bar', 'baz');
});

test('`publish`ed objects will unsubscribe themselves upon destruction', function(assert) {
  assert.expect(1);

  const done = assert.async();

  const service = this.subject();

  const cb = function() {};

  const component = Ember.Component.create();
  const router = Ember.Router.create();
  const componentStable = Ember.Component.create();

  service.subscribe('foo', component, cb);
  service.subscribe('foo', router, cb);
  service.subscribe('foo', componentStable, cb);

  Ember.run(() => {
    component.trigger('willDestroyElement');
    router.trigger('willDestroy');
  });

  Ember.run.later(() => {
    assert.equal(service.get('_subscriptionMap.foo.length'), 1, 'destroyed registrants removed');

    done();
  }, 250);
});

test('`unsubscribe` removes all subscriptions with the provided context and callback', function(assert) {
  assert.expect(1);

  const service = this.subject();

  const cb1 = function() {};
  const cb2 = function() {};

  const context1 = Ember.Component.create();
  const context2 = Ember.Component.create();

  service.subscribe('foo', context1, cb1);
  service.subscribe('foo', context1, cb2);
  service.subscribe('foo', context1, cb1);
  service.subscribe('foo', context2, cb1);
  service.subscribe('bar', context1, cb1);

  service.unsubscribe('foo', context1, cb1);

  assert.deepEqual(service.get('_subscriptionMap'), { foo: [{ context: context1, callback: cb2 }, { context: context2, callback: cb1 }], bar: [{ context: context1, callback: cb1 }] }, 'only removed specific context and callback');
});

test('`unsubscribe` removes all subscriptions with the provided context if no callback is provided', function(assert) {
  assert.expect(1);

  const service = this.subject();

  const cb1 = function() {};
  const cb2 = function() {};

  const context1 = Ember.Component.create();
  const context2 = Ember.Component.create();

  service.subscribe('foo', context1, cb1);
  service.subscribe('foo', context1, cb2);
  service.subscribe('foo', context1, cb1);
  service.subscribe('foo', context2, cb1);
  service.subscribe('bar', context1, cb1);

  service.unsubscribe('foo', context1);

  assert.deepEqual(service.get('_subscriptionMap'), { foo: [{ context: context2, callback: cb1 }], bar: [{ context: context1, callback: cb1 }] }, 'only removed specific context');
});

test('`unsubscribeAll` removes all subscriptions for the provided context', function(assert) {
  assert.expect(1);

  const service = this.subject();

  const cb1 = function() {};
  const cb2 = function() {};

  const context1 = Ember.Component.create();
  const context2 = Ember.Component.create();

  service.subscribe('foo', context1, cb1);
  service.subscribe('foo', context1, cb2);
  service.subscribe('foo', context1, cb1);
  service.subscribe('foo', context2, cb1);
  service.subscribe('bar', context1, cb1);

  service.unsubscribeAll(context1);

  assert.deepEqual(service.get('_subscriptionMap'), { foo: [{ context: context2, callback: cb1 }] }, 'removes specified context for all names');
});
