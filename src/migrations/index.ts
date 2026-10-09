import * as migration_20260123_132509_committee_migration from './20260123_132509_committee_migration';
import * as migration_20261008_094434_fix_delegate_gender from './20261008_094434_fix_delegate_gender';
import * as migration_20261008_101243_delegate_registration from './20261008_101243_delegate_registration';

export const migrations = [
  {
    up: migration_20260123_132509_committee_migration.up,
    down: migration_20260123_132509_committee_migration.down,
    name: '20260123_132509_committee_migration',
  },
  {
    up: migration_20261008_094434_fix_delegate_gender.up,
    down: migration_20261008_094434_fix_delegate_gender.down,
    name: '20261008_094434_fix_delegate_gender',
  },
  {
    up: migration_20261008_101243_delegate_registration.up,
    down: migration_20261008_101243_delegate_registration.down,
    name: '20261008_101243_delegate_registration'
  },
];
