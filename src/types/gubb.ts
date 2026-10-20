export type GubbResponse = {
    url: string | null;
    jobId: string | null;
    status: string | null;
    statusUrl: string | null;
    error: string | null;
}

export type AdminVideo = {
    jobId: string;
    url: string;
    statusUrl: string | null;
    path: string;
    sizeBytes: number;
    storedAt: string;
    expiresAt: string | null;
    expired: boolean;
    jobStatus: string | null;
    jobUpdatedAt: string | null;
}
