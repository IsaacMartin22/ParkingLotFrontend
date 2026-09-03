const { Opik } = require("opik");

const OPIK_PROJECT_NAME = "parking-lot-frontend";
const OPIK_WORKSPACE = "isaacmartin22";
const OPIK_API_KEY = "SgHlURttWyhhoTY5OmqrarTxj";

async function main() {
    const client = new Opik({
        apiKey: OPIK_API_KEY,
        workspaceName: OPIK_WORKSPACE,
        apiUrl: "https://www.comet.com/opik/api",
        projectName: OPIK_PROJECT_NAME,
    });

    const trace = client.trace({
        name: "verify-opik-instrumentation",
        input: {
            command: "node scripts/verify-opik.js",
        },
        metadata: {
            repo: "ParkingLotFrontend",
            runtime: "node",
        },
        tags: ["verification", "manual"],
    });

    const span = trace.span({
        name: "build-static-app-context",
        type: "tool",
        input: {
            framework: "create-react-app",
            reason: "browser bundle cannot include opik Node dependencies",
        },
    });

    span.end({
        output: {
            status: "verified",
        },
    });
    trace.end({
        output: {
            status: "verified",
        },
    });
    await client.flush({ silent: true });

    const traces = await client.searchTraces({
        projectName: OPIK_PROJECT_NAME,
        filterString: 'name = "verify-opik-instrumentation"',
        maxResults: 5,
        waitForAtLeast: 1,
        waitForTimeout: 15,
    });

    const newestTrace = traces.sort((left, right) => {
        return new Date(right.startTime).getTime() - new Date(left.startTime).getTime();
    })[0];

    if (!newestTrace?.id) {
        throw new Error("Trace was not found in Opik after flush");
    }

    const traceUrl = `https://www.comet.com/opik/${OPIK_WORKSPACE}/projects/${encodeURIComponent(OPIK_PROJECT_NAME)}/traces/${newestTrace.id}`;
    console.log(JSON.stringify({
        traceId: newestTrace.id,
        traceUrl,
    }));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
