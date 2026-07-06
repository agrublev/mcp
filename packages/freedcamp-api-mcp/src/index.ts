#!/usr/bin/env node
import dotenv from 'dotenv';
import { runFreedcampMcpServer } from './server.js';

dotenv.config();

function parseArgs(argv: string[]): { apiKey?: string; apiSecret?: string } {
  const result: { apiKey?: string; apiSecret?: string } = {};
  for (let i = 0; i < argv.length; i++) {
    if ((argv[i] === '--api-key' || argv[i] === '-k') && i + 1 < argv.length) {
      result.apiKey = argv[i + 1];
    }
    if ((argv[i] === '--api-secret' || argv[i] === '-s') && i + 1 < argv.length) {
      result.apiSecret = argv[i + 1];
    }
  }
  // Fall back to environment variables
  if (!result.apiKey && process.env.FREEDCAMP_API_KEY) {
    result.apiKey = process.env.FREEDCAMP_API_KEY;
  }
  if (!result.apiSecret && process.env.FREEDCAMP_API_SECRET) {
    result.apiSecret = process.env.FREEDCAMP_API_SECRET;
  }
  return result;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.apiKey) {
    console.error(
      'Error: Freedcamp API key is required.\n' +
        'Provide it via:\n' +
        '  --api-key <key>   (command-line flag)\n' +
        '  FREEDCAMP_API_KEY  (environment variable)',
    );
    process.exit(1);
  }

  await runFreedcampMcpServer({ apiKey: args.apiKey, apiSecret: args.apiSecret });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
