import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:message-bus', 'Unit | Service | message bus', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
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
