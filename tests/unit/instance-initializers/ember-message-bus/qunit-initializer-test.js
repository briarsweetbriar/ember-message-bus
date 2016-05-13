import Ember from 'ember';
import { module, test } from 'qunit';
import destroyApp from '../../../helpers/destroy-app';
import { initializeQUnit } from 'ember-message-bus';

module('Unit | Instance Initializer | ember message bus/qunit initializer', {
  beforeEach: function() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach: function() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

test('`published` is added to Qunit.assert', function(assert) {
  assert.expect(1);

  initializeQUnit(this.appInstance);

  assert.ok(QUnit.assert.published, 'function is present');
});

test('`notPublished` is added to Qunit.assert', function(assert) {
  assert.expect(1);

  initializeQUnit(this.appInstance);

  assert.ok(QUnit.assert.notPublished, 'function is present');
});
