import * as migration_20261029_032513 from './20261029_032513';
import * as migration_20261029_051810 from './20261029_051810';

export const migrations = [
  {
    up: migration_20261029_032513.up,
    down: migration_20261029_032513.down,
    name: '20261029_032513',
  },
  {
    up: migration_20261029_051810.up,
    down: migration_20261029_051810.down,
    name: '20261029_051810'
  },
];
