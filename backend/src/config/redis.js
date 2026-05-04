import Redis from "ioredis";

let redis;

try {
  redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
     retryStrategy: () => null
  });

  redis.on("error", (err) => {
    console.log("Redis error (ignored):", err.message);
  });

} catch (err) {
  console.log("Redis not available");
}

export { redis };