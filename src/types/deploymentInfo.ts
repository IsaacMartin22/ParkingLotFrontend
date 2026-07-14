export interface DeploymentResponse {
  deploy: Deploy;
  cursor: string;
}

export interface Deploy {
  id: string;
  commit: Commit;
  status: string;
  trigger: string;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Commit {
  id: string;
  message: string;
  createdAt: string;
}
