import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { faker } from '@faker-js/faker';
import { Building } from '../src/app/buildings/model/building.interface';
import { BUILDING_TYPES, SITE_TYPES, TAG_POOL } from '../mock/constants';
import { Site } from '../src/app/sites/model/site.interface';

const OUT_DIR = join(__dirname, '../mock/data');

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

function generateTags(min: number = 3, max: number = 5): string[] {
  return faker.helpers.arrayElements(TAG_POOL, faker.number.int({ min, max }));
}

function generateBuildings(count: number = 100): Building[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.nanoid(5),
    name: faker.company.name(),
    tags: generateTags(),
    buildingType: faker.helpers.arrayElement(BUILDING_TYPES),
  }));
}

function generateSites(count: number = 100): Site[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.nanoid(7),
    name: faker.location.city(),
    tags: generateTags(),
    siteType: faker.helpers.arrayElement(SITE_TYPES),
  }));
}

function extractTags(buildings: Building[], sites: Site[]): string[] {
  return Array.from(
    new Set([
      ...buildings.flatMap((b) => b.tags),
      ...sites.flatMap((s) => s.tags),
    ])
  );
}

function writeMockData(fileName: string, data: unknown): void {
  writeFileSync(join(OUT_DIR, fileName), JSON.stringify(data, null, 2));
}

let buildings: Building[];
let sites: Site[];
let tags: string[];

try {
  buildings = generateBuildings(10_000);
  sites = generateSites(10_000);
  tags = extractTags(buildings, sites);
} catch (error) {
  console.error('❌ Error generating mock data:', error);
  process.exit(1);
}

try {
  writeMockData('buildings.json', buildings);
  writeMockData('sites.json', sites);
  writeMockData('tags.json', tags);
} catch (error) {
  console.error('❌ Error writing mock data to files:', error);
}

console.info('📦 mock data generated into', OUT_DIR);
