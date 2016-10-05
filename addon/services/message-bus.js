import Ember from 'ember';

const {
  Service,
  computed,
  get,
  isBlank,
  set
} = Ember;

export default Service.extend({
  subscriptionMap: computed(() => { return {}; }),

  publish(name, ...messages) {
    (get(this, `subscriptionMap.${name}`) || []).forEach((subscription) => {
      subscription.callback.apply(subscription.context, messages);
    });
  },

  subscribe(name, context, callback) {
    const subscriptions = get(this, `subscriptionMap.${name}`) || set(this, `subscriptionMap.${name}`, []);

    subscriptions.push({ callback, context });
  },

  unsubscribe(name, context, callback) {
    const subscriptions = get(this, `subscriptions.${name}`);

    if (isBlank(subscriptions)) { return; }

    const blankCallback = isBlank(callback);

    const indices = subscriptions.reduce((indices, subscription, index) => {
      if ((blankCallback || subscription.callback === callback) && subscription.context === context) {
        indices.push(index);
      }

      return indices;
    }, []);

    indices.reverse().forEach((index) => subscriptions.slice(index, 1));
  },

  unsubscribeAll(context) {
    const subscriptionMap = get(this, 'subscriptionMap');

    Object.keys(subscriptionMap).forEach((name) => this.unsubscribe(name, context));
  }
});
