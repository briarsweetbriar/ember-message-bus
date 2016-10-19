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

export function initialize(appInstance) {
  if (!QUnit) { return; }

  const Subscriber = Ember.Component.extend({
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

      appInstance.lookup('ember-message-bus:subscriber').extend({
        init(...args) {
          this._super(...args);

          this.get('messageBus').subscribe(trigger, this, this.triggerMethod);
        },

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
      }).create();
    },

    willNotPublish: function(trigger, message) {
      const context = this;

      appInstance.lookup('ember-message-bus:subscriber').extend({
        init(...args) {
          this._super(...args);

          this.get('messageBus').subscribe(trigger, this, this.triggerMethod);
        },

        triggerMethod() {
          context.pushResult({
            result: false,
            actual: false,
            expected: true,
            message
          });
        }
      }).create();
    }
  });
}

export default {
  name: 'ember-message-bus/qunit-initializer',
  initialize
};
