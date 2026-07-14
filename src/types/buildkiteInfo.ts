export type BuildkitePipeline = {
  id: string;
  name: string;
  slug: string;
};

export type BuildkiteBuildResponse = {
  id: string;
  number: number | null;
  state: string | null;
  blocked: boolean;
  cancel_reason: string | null;
  message: string | null;
  commit: string | null;
  branch: string | null;
  source: string | null;
  pipeline: BuildkitePipeline | null;
  created_at: string | null;
  scheduled_at: string | null;
  started_at: string | null;
  finished_at: string | null;
};
