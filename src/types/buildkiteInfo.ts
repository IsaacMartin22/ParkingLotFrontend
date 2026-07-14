export type BuildkitePipeline = {
  id: string;
  name: string;
  slug: string;
};

export type BuildkiteBuildResponse = {
  id: string;
  number: number | null;
  state: string;
  blocked: boolean;
  cancelReason: string | null;
  message: string;
  commit: string;
  branch: string;
  source: string;
  pipeline: BuildkitePipeline | null;
  createdAt: string | null;
  scheduledAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
};
