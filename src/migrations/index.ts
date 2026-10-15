import * as migration_20261013_080750 from './20261013_080750';
import * as migration_20261013_131611_add_recipient_to_receipts from './20261013_131611_add_recipient_to_receipts';

export const migrations = [
  {
    up: migration_20261013_080750.up,
    down: migration_20261013_080750.down,
    name: '20261013_080750',
  },
  {
    up: migration_20261013_131611_add_recipient_to_receipts.up,
    down: migration_20261013_131611_add_recipient_to_receipts.down,
    name: '20261013_131611_add_recipient_to_receipts'
  },
];
