import * as github from '@actions/github';

type Octokit = ReturnType<typeof github.getOctokit>;

type Params = {
  octokit: Octokit;
  owner: string;
  repo: string;
  headSha: string;
  headRef: string;
  name: string;
};

export async function startBuild({
  octokit,
  owner,
  repo,
  headSha: head_sha,
  name = 'Screenshot Diff',
}: Params): Promise<any> {
  const {data: check} = await octokit.checks.create({
    owner,
    repo,
    head_sha,
    name,
    status: 'in_progress',
  });

  return check.id;
}
