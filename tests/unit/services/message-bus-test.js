import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:message-bus', 'Unit | Service | message bus', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('`register` adds a subscriber', function(assert) {
  assert.expect(1);

  const service = this.subject();
  const object = Ember.Object.create();

  service.register(object);

  assert.deepEqual(service.get('subscribers'), Ember.A([object]), 'subscriber added');
});

test('`register` can add multiple subscribers', function(assert) {
  assert.expect(1);

  const service = this.subject();
  const object = Ember.Object.create();
  const object2 = Ember.Object.create();

  service.register(object);
  service.register(object2);

  assert.deepEqual(service.get('subscribers'), Ember.A([object, object2]), 'subscribers added');
});

test('`register` will not add duplicate subscribers', function(assert) {
  assert.expect(1);

  const service = this.subject();
  const object = Ember.Object.create();

  service.register(object);
  service.register(object);

  assert.deepEqual(service.get('subscribers'), Ember.A([object]), 'only one instance of subscriber added');
});

test('`unregister` removes a subscriber', function(assert) {
  assert.expect(1);

  const service = this.subject();
  const object = Ember.Object.create();

  service.register(object);
  service.unregister(object);

  assert.deepEqual(service.get('subscribers'), Ember.A([]), 'subscriber removed added');
});

test('`unregister` removes a subscriber when others are present', function(assert) {
  assert.expect(1);

  const service = this.subject();
  const object = Ember.Object.create();
  const object2 = Ember.Object.create();

  service.register(object);
  service.register(object2);
  service.unregister(object);

  assert.deepEqual(service.get('subscribers'), Ember.A([object2]), 'non-removed subscribers remain');
});

test('`unregister` does nothing if the object is not subscribing', function(assert) {
  assert.expect(1);

  const service = this.subject();
  const object = Ember.Object.create();
  const object2 = Ember.Object.create();

  service.register(object2);
  service.unregister(object);

  assert.deepEqual(service.get('subscribers'), Ember.A([object2]), 'did nothing');
});

test('`publish` calls the `trigger` on all subscribers', function(assert) {
  assert.expect(4);

  const service = this.subject();

  const object = Ember.Object.create({
    trigger(name, ...messages) {
      assert.equal(name, 'foo', 'name is passed through to object');
      assert.deepEqual(messages, ['bar', 'baz'], 'messages are passed through to object');
    }
  });

  const object2 = Ember.Object.create({
    trigger(name, ...messages) {
      assert.equal(name, 'foo', 'name is passed through to object2');
      assert.deepEqual(messages, ['bar', 'baz'], 'messages are passed through to object2');
    }
  });

  service.register(object);
  service.register(object2);

  service.publish('foo', 'bar', 'baz');
});
