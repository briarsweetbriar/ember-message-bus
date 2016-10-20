import Ember from 'ember';

const {
  Service,
  computed,
  get,
  isBlank,
  isNone,
  set
} = Ember;

export default Service.extend({
  _subscriptionMap: computed(() => { return {}; }),

  publish(name, ...messages) {
    const markedForCleanup = [];

    (get(this, `_subscriptionMap.${name}`) || []).forEach((subscription) => {
      if (isNone(subscription.context) || get(subscription.context, 'isDestroyed')) {
        return markedForCleanup.push(subscription.context);
      }

      subscription.callback.apply(subscription.context, messages);
    });

    markedForCleanup.forEach((context) => this.unsubscribe(name, context));
  },

  subscribe(name, context, callback) {
    const subscriptions = get(this, `_subscriptionMap.${name}`) || set(this, `_subscriptionMap.${name}`, []);

    subscriptions.push({ callback, context });
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
