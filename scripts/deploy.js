const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const buildDir = path.join(projectRoot, "build");
const targetRepo = path.resolve(projectRoot, "../isaacmartin22.github.io");

if (!fs.existsSync(buildDir)) {
    console.error("Build directory does not exist.");
    process.exit(1);
}

if (!fs.existsSync(targetRepo)) {
    console.error(`Target repository not found: ${targetRepo}`);
    process.exit(1);
}

console.log("Cleaning target repository...");

// Remove everything except .git
for (const file of fs.readdirSync(targetRepo)) {
    if (file === ".git" || file === ".gitignore" || file === ".idea") continue;

    fs.rmSync(path.join(targetRepo, file), {
        recursive: true,
        force: true,
    });
}

console.log("Copying build files...");

// Copy build contents
fs.cpSync(buildDir, targetRepo, {
    recursive: true,
});

console.log("Committing changes...");

execSync("git add .", {
    cwd: targetRepo,
    stdio: "inherit",
});

try {
    execSync(`git commit -m "Deploy ${new Date().toISOString()}"`, {
        cwd: targetRepo,
        stdio: "inherit",
    });
} catch {
    console.log("No changes to commit.");
}

execSync("git push", {
    cwd: targetRepo,
    stdio: "inherit",
});

console.log("Deployment complete.");