import * as github from '@actions/github';

type Octokit = ReturnType<typeof github.getOctokit>;

type Params = {
  octokit: Octokit;
  id: number;
  owner: string;
  repo: string;
  headSha: string;
  images: {
    alt: string;
    image_url: string;
  }[];
  results: {
    baseFilesLength: number;
    changed: string[];
    missing: string[];
    added: string[];
  };
  galleryUrl?: string;
};

export async function finishBuild({...body}: Params) {
  const {owner, repo, galleryUrl, id, images, results, octokit} = body;
  const {baseFilesLength, changed, missing, added} = results;
  const unchanged = baseFilesLength - (changed.length + missing.length);

  const totalChanged = changed.length + missing.length;
  const conclusion = 'neutral';

  const title =
    totalChanged > 0
      ? `${totalChanged} snapshots need review`
      : added.length
      ? `${added.length} new snapshots`
      : 'No snapshot changes detected';

  return await octokit.checks.update({
    check_run_id: id,
    owner,
    repo,
    // details_url: galleryUrl,
    status: 'completed',
    conclusion,
    output: {
      title,
      summary: `
${galleryUrl ? `[View Image Gallery](${galleryUrl})` : ''}

* **${changed.length}** changed snapshots (${unchanged} unchanged)
* **${missing.length}** missing snapshots
* **${added.length}** new snapshots`,
      text: `
${!changed.length && !missing.length && !added.length ? '## No changes' : ''}

${
  changed.length
    ? `## Changed snapshots
${[...changed].map(name => `* ${name}`).join('\n')}
`
    : ''
}

${
  missing.length
    ? `## Missing snapshots
${[...missing].map(name => `* ${name}`).join('\n')}
`
    : ''
}

${
  added.length
    ? `## New snapshots
${[...added].map(name => `* ${name}`).join('\n')}
`
    : ''
}`,
      images,
    },
  });
}
