import yaml from 'js-yaml';
import { promisify } from 'util';

const readFile = promisify((await import('fs')).readFile);
const writeFile = promisify((await import('fs')).writeFile);

if (process.argv.length < 3) {
  console.error('Input file not provided');
  process.exit(2);
}

if (process.argv.length < 4) {
  console.error('Output file not provided');
  process.exit(2);
}

try {
  await writeFile(process.argv[3], JSON.stringify(yaml.load(await readFile(process.argv[2]))));
} catch (e) {
  console.error(e);
  process.exit(1);
}
