import * as github from '@actions/github';
type Octokit = ReturnType<typeof github.getOctokit>;

type Params = {
  octokit: Octokit;
  id: number;
  owner: string;
  repo: string;
  headSha: string;
};

/**
 * Fails a build due to another error
 */
export async function failBuild({octokit, ...body}: Params) {
  const failureBody = {
    status: 'completed',
    conclusion: 'failure',
    title: 'Internal Error',
    summary: 'There was an error processing the snapshots',
  };

  const {owner, repo, id} = body;

  const {title, summary, ...checkBody} = failureBody;

  // @ts-ignore
  return await octokit.checks.update({
    check_run_id: id,
    owner,
    repo,
    ...checkBody,
    output: {
      title,
      summary,
    },
  });
}
