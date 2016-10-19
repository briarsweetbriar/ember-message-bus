import Ember from 'ember';

const {
  Service,
  computed,
  get,
  isBlank,
  set,
  typeOf
} = Ember;

const { Logger: { warn } } = Ember;

export default Service.extend({
  _subscriptionMap: computed(() => { return {}; }),

  publish(name, ...messages) {
    (get(this, `_subscriptionMap.${name}`) || []).forEach((subscription) => {
      subscription.callback.apply(subscription.context, messages);
    });
  },

  subscribe(name, context, callback) {
    const subscriptions = get(this, `_subscriptionMap.${name}`) || set(this, `_subscriptionMap.${name}`, []);

    subscriptions.push({ callback, context });

    if (typeOf(context.on) !== 'function') { return warn(`You subscribed the context ${context} to the message '${name}', but the context does not support events. Please add the \`Ember.Evented\` mixin to the context so that \`ember-message-bus\` can properly remove listeners when the context is destroyed.`); }

    context.on('willDestroy', () => {
      this.unsubscribe(name, context, callback);
    });

    context.on('willDestroyElement', () => {
      this.unsubscribe(name, context, callback);
    });
  },

  unsubscribe(name, context, callback) {
    const subscriptionMap = get(this, `_subscriptionMap`);
    const subscriptions = get(subscriptionMap, name);

    if (isBlank(subscriptions)) { return; }

    const blankCallback = isBlank(callback);

    const indices = subscriptions.reduce((indices, subscription, index) => {
      if ((blankCallback || subscription.callback === callback) && subscription.context === context) {
        indices.push(index);
      }

      return indices;
    }, []);

    indices.reverse().forEach((index) => subscriptions.splice(index, 1));

    if (subscriptions.length === 0) {
      delete subscriptionMap[name];
    }
  },

  unsubscribeAll(context) {
    const subscriptionMap = get(this, '_subscriptionMap');

    Object.keys(subscriptionMap).forEach((name) => this.unsubscribe(name, context));
  }
});
