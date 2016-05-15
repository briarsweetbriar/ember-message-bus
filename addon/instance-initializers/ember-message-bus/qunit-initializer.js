import Ember from 'ember';
import config from 'ember-get-config';
import { BusSubscriberMixin } from 'ember-message-bus';

const {
  get,
  on,
  typeOf
} = Ember;

export function initialize(appInstance) {
  if (get(config, 'environment') !== 'test' || !QUnit) { return; }

  const Subscriber = Ember.Object.extend(BusSubscriberMixin);

  appInstance.register('ember-message-bus:subscriber', Subscriber, { instantiate: false });

  QUnit.extend(QUnit.assert, {
    willPublish: function(trigger, expectedOrMessage, onlyMessage) {
      const pushResult = (result, actual, expected, message) => {
        this.pushResult({
          actual,
          expected,
          message,
          result
        });
      };

      appInstance.lookup('ember-message-bus:subscriber').extend({
        triggerMethod: on(trigger, function(...args) {
          if (typeOf(expectedOrMessage) === 'array') {
            const result = args.every((arg, index) => {
              return QUnit.equiv(arg, expectedOrMessage[index]);
            });

            pushResult(result, args, expectedOrMessage, onlyMessage);
          } else {
            pushResult(true, true, true, expectedOrMessage);
          }
        })
      }).create();
    },

    willNotPublish: function(trigger, message) {
      const context = this;

      appInstance.lookup('ember-message-bus:subscriber').extend({
        triggerMethod: on(trigger, function() {
          context.pushResult({
            result: false,
            actual: false,
            expected: true,
            message
          });
        })
      }).create();
    }
  });
}

export default {
  name: 'ember-message-bus/qunit-initializer',
  initialize
};
