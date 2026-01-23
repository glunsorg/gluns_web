import * as migration_20251219_113927 from './20251219_113927';
import * as migration_20260123_084431_add_roles_column from './20260123_084431_add_roles_column';

export const migrations = [
  {
    up: migration_20251219_113927.up,
    down: migration_20251219_113927.down,
    name: '20251219_113927',
  },
  {
    up: migration_20260123_084431_add_roles_column.up,
    down: migration_20260123_084431_add_roles_column.down,
    name: '20260123_084431_add_roles_column'
  },
];
