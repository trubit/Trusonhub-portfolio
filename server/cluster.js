import cluster from "cluster";
import { cpus } from "os";

if (cluster.isPrimary) {
  const numWorkers = cpus().length;
  console.log(`Primary ${process.pid}: spawning ${numWorkers} workers`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.warn(`Worker ${worker.process.pid} died (${signal ?? code}) — restarting`);
    cluster.fork();
  });
} else {
  await import("./index.js");
}
