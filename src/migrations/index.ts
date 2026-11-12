import * as migration_20261029_032513 from './20261029_032513';
import * as migration_20261029_051810 from './20261029_051810';
import * as migration_20261109_031428 from './20261109_031428';
import * as migration_20261109_032201 from './20261109_032201';
import * as migration_20261109_033814 from './20261109_033814';
import * as migration_20261111_235112_add_organ_details_remove_committee_image from './20261111_235112_add_organ_details_remove_committee_image';

export const migrations = [
  {
    up: migration_20261029_032513.up,
    down: migration_20261029_032513.down,
    name: '20261029_032513',
  },
  {
    up: migration_20261029_051810.up,
    down: migration_20261029_051810.down,
    name: '20261029_051810',
  },
  {
    up: migration_20261109_031428.up,
    down: migration_20261109_031428.down,
    name: '20261109_031428',
  },
  {
    up: migration_20261109_032201.up,
    down: migration_20261109_032201.down,
    name: '20261109_032201',
  },
  {
    up: migration_20261109_033814.up,
    down: migration_20261109_033814.down,
    name: '20261109_033814',
  },
  {
    up: migration_20261111_235112_add_organ_details_remove_committee_image.up,
    down: migration_20261111_235112_add_organ_details_remove_committee_image.down,
    name: '20261111_235112_add_organ_details_remove_committee_image'
  },
];
