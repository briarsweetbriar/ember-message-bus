import Ember from 'ember';
import { module, test } from 'qunit';
import destroyApp from '../../../helpers/destroy-app';
import { initializeQUnitAssertions } from 'ember-message-bus';

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

test('`willPublish` is added to Qunit.assert', function(assert) {
  assert.expect(1);

  initializeQUnitAssertions(this.appInstance);

  assert.ok(QUnit.assert.willPublish, 'function is present');
});

test('`willNotPublish` is added to Qunit.assert', function(assert) {
  assert.expect(1);

  initializeQUnitAssertions(this.appInstance);

  assert.ok(QUnit.assert.willNotPublish, 'function is present');
});
