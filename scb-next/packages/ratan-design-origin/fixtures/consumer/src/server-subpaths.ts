import * as core from 'ratan-design-origin';
import * as direct from './subpaths';

for (const [name, value] of Object.entries(direct)) {
  if (core[name as keyof typeof core] !== value) {
    throw new Error(`Component subpath changed the existing ${name} export`);
  }
}
console.log('Direct component exports preserve root export identity.');
