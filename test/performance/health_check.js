import grpc from "k6/net/grpc";
import { check, sleep } from "k6";

const client = new grpc.Client();
client.load(["./proto"], "health/v1/health.proto");

export const options = {
  stages: [
    { duration: "10s", target: 400 }, // ramp up to 400 users
    { duration: "50s", target: 400 }, // stay at 400 for 50 seconds
  ],
};

export default () => {
  client.connect("localhost:8080", {
    plaintext: true,
  });

  const data = {};
  const response = client.invoke("grpc.health.v1.Health/Check", data);

  check(response, {
    "status is OK": (r) => r && r.status === grpc.StatusOK,
  });

  client.close();
  sleep(1);
};
