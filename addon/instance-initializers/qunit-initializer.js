import Ember from 'ember';

const {
  typeOf
} = Ember;

const resolveCallback = function resolveCallback(callback, args) {
  return callback(...args);
};

const resolveEquiv = function resolveEquiv(expected, args) {
  return args.every((arg, index) => {
    return QUnit.equiv(arg, expected[index]);
  });
};

export function initialize(appInstance, name = 'messageBus', SubscriberArg = '') {
  if (!QUnit) { return; }

  const Subscriber = Ember.isPresent(SubscriberArg) ? SubscriberArg : Ember.Object.extend({
    messageBus: Ember.inject.service('message-bus')
  });

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

      const subscriber = appInstance.factoryFor('ember-message-bus:subscriber').create({
        triggerMethod(...args) {
          if (typeOf(expectedOrMessage) === 'string') {
            pushResult(true, true, true, expectedOrMessage);
          } else {
            const result = typeOf(expectedOrMessage) === 'function' ?
              resolveCallback(expectedOrMessage, args) :
              resolveEquiv(expectedOrMessage, args);

            pushResult(result, args, expectedOrMessage, onlyMessage);
          }
        }
      });

      subscriber.get(name).subscribe(trigger, subscriber, subscriber.triggerMethod);
    },

    willNotPublish: function(trigger, message) {
      const context = this;

      const subscriber = appInstance.factoryFor('ember-message-bus:subscriber').create({
        triggerMethod() {
          context.pushResult({
            result: false,
            actual: false,
            expected: true,
            message
          });
        }
      });

      subscriber.get(name).subscribe(trigger, subscriber, subscriber.triggerMethod);
    }
  });
}

export default {
  name: 'ember-message-bus/qunit-initializer',
  initialize
};
