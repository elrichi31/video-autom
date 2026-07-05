import { execSync } from "node:child_process";

const port = Number(process.argv[2] ?? "3001");

if (!Number.isInteger(port) || port <= 0) {
  console.error(`[free-port] Invalid port: ${process.argv[2] ?? ""}`);
  process.exit(1);
}

const isWindows = process.platform === "win32";

const getPids = () => {
  try {
    if (isWindows) {
      const output = execSync(`netstat -ano -p tcp | findstr :${port}`, { stdio: ["ignore", "pipe", "ignore"] })
        .toString();

      return [...new Set(
        output
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .filter((line) => line.includes("LISTENING"))
          .map((line) => line.split(/\s+/).at(-1))
          .filter((pid) => pid && /^\d+$/.test(pid)),
      )];
    }

    const output = execSync(`lsof -ti tcp:${port}`, { stdio: ["ignore", "pipe", "ignore"] }).toString();
    return [...new Set(
      output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((pid) => /^\d+$/.test(pid)),
    )];
  } catch {
    return [];
  }
};

const killPid = (pid) => {
  try {
    if (isWindows) {
      execSync(`taskkill /PID ${pid} /F`, { stdio: ["ignore", "ignore", "ignore"] });
      return true;
    }

    process.kill(Number(pid), "SIGKILL");
    return true;
  } catch {
    return false;
  }
};

const pids = getPids();

if (pids.length === 0) {
  console.log(`[free-port] Port ${port} is already free.`);
  process.exit(0);
}

const killed = pids.filter(killPid);

if (killed.length > 0) {
  console.log(`[free-port] Freed port ${port} by stopping PID(s): ${killed.join(", ")}.`);
  process.exit(0);
}

console.error(`[free-port] Found PID(s) on port ${port} but could not stop them: ${pids.join(", ")}.`);
process.exit(1);
