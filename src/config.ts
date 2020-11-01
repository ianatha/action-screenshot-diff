import * as core from '@actions/core';

export const API_ENDPOINT =
  core.getInput('api-endpoint') ||
  'https://sentry-visual-snapshot-dwunkkvj6a-uc.a.run.app/api';
