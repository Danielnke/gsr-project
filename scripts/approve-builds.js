const { writeFileSync } = require('fs');
const path = require('path');

// List of packages that require build steps that should be pre-approved
const allowedBuilds = [
  '@tailwindcss/oxide',
  '@tsparticles/engine',
  'react-tsparticles',
  'sharp',
  'tsparticles-engine',
  'unrs-resolver'
];

// Create the pnpm approved packages configuration
const config = {
  $schema: 'https://pnpm.io/schema/approved-packages.json',
  allowedBinaries: [],
  allowedDeprecatedVersions: {},
  allowedExtensions: [],
  allowedPackages: allowedBuilds.reduce((acc, pkg) => {
    acc[pkg] = { allowed: '*' };
    return acc;
  }, {})
};

// Write the configuration file to the project root
writeFileSync(
  path.join(process.cwd(), '.pnpm-approved-packages.json'),
  JSON.stringify(config, null, 2)
);

console.log('Created .pnpm-approved-packages.json with pre-approved build packages');