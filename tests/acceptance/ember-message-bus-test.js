import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | ember message bus');

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('#value').text().trim(), '1', 'subscriber/publisher communicated');
  });
});
