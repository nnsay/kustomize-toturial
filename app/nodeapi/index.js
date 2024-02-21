"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const k8s = require("@kubernetes/client-node");
const events = require("events");
const { HTTP } = require("cloudevents");

const kc = new k8s.KubeConfig();
// const apiHost = "https://127.0.0.1:6443";
const apiHost = "https://kubernetes.default.svc";
kc.loadFromString(`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCVENDQWUyZ0F3SUJBZ0lJTmUvL0UzbktIU2t3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TkRBeE1UQXdOelEyTlRSYUZ3MHpOREF4TURjd056VXhOVFJhTUJVeApFekFSQmdOVkJBTVRDbXQxWW1WeWJtVjBaWE13Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLCkFvSUJBUURYZE0zUVVqU0tRZWNrbitVb3BsaFFMZlhSQ2dMTTFJMXFZcXdDNnlKNFFraHJqMW1uMHQzWktnNGEKOEZCcmJmY3JRa01CN2E0dDFsMURLV2kyd1luQWJKWURORVVLbnVXaDREVDEvckMrWjJrcUFxbTBVYk1IWGdxQgp3SS8yWVBMR3pzeVlrcVc3NkJPV2M4cVgzdzhDNGVXTkh4RnFhbFBPWkpUMXZGcXkxNEppWkVJbjdWVDJJM0V6CjhGallmcEt4ZndDZVI5c3YzVnZkK0tNUWx6Vy9GOERiZVN1cmZmb0htSlZ2OXBVVFI1S0ZqYVFTd2JPN0REc2cKSWU1RUV4SzkyR1h6b1ZVQnM4V2hBTnkzYjN6cytrQU91eEtyRUpHRmVnZmo5K2lMWnRobElFTkdWejY2RytYKwpzclMrMitoVHl0dmxEZnZYUldnVklKbkw3bDYvQWdNQkFBR2pXVEJYTUE0R0ExVWREd0VCL3dRRUF3SUNwREFQCkJnTlZIUk1CQWY4RUJUQURBUUgvTUIwR0ExVWREZ1FXQkJRdVZRMXNNQ1ZxZ3BtaXRqdXVHb3NUR3Q1TkxqQVYKQmdOVkhSRUVEakFNZ2dwcmRXSmxjbTVsZEdWek1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRREZUME5ZaFhvaQpXQjkzcVl5dnZlQlQvVFpaTkE3Q1RTYkFSSFpQSTFBajBVZ3lNZERxd3BlbUt4eEhMMTljdnBBaWJRaGNHc24zCkhhTlgvZzRhWHZxdmVUaUMyQzBodUYzbGFqSUFreExlQkxPdG9rTEcxNHA1T0xCdGQwR0VUSzNwRVZkeVRreGsKbWFHOW8zU2pjT3QvbFU2bTFIQWRyRk1iVlZ1NUZubjBGZHBlVVkxWjlUbk4rZkZLb3dIK3pwZUZHMndSN0RjdQpaNWFzdlJuS2QxVmFGc1Ywb2xSRndqampmVlhKYmFZOTR4Y1B5dVFSSnFBdktycHJOSzU1dVRBcGlWQmVaMUxHCi9iNUJYVE5mY3I0M1dZZTNJMDVVMU9jeTdsaGlPVFJ2bnlZRUVDRTc0cVVLVzA2M0NoVzR2ditOTU1xRWNVUUsKOEpEN2V5aDFKNHNuCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    server: ${apiHost}
  name: docker-desktop
contexts:
- context:
    cluster: docker-desktop
    namespace: tutorial
    user: docker-desktop
  name: docker-desktop
current-context: docker-desktop
kind: Config
preferences: {}
users:
- name: docker-desktop
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURRakNDQWlxZ0F3SUJBZ0lJQWFBM3RhVURTaUV3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TkRBeE1UQXdOelEyTlRSYUZ3MHlOVEF4TWpReE1EVXpNVE5hTURZeApGekFWQmdOVkJBb1REbk41YzNSbGJUcHRZWE4wWlhKek1Sc3dHUVlEVlFRREV4SmtiMk5yWlhJdFptOXlMV1JsCmMydDBiM0F3Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLQW9JQkFRRE10LzUvWExQa0xBdlUKRlJ5SDE4aFJiMFM5YVVNdmFBNCtwNkZ2VFZXbmtuR2VJeklZMG02N2ZydEJldUIyeWhhU05UN1VYdXhLN0xpZAo0MlFHc0VhNHZWRUQwdTJqMVYzWjJUSE5ENzZEOWlOK2xoWDFUUEZkZXhrTXRxRVZ2dk5xTG1PYXVHWWZBS2FMCmNYdWVpZ0tnM0t6THNoOGpDbGlNcU1PcDJOa3ZBZmVKb1ljVVJqeVVIL0JTODNHT0E3T2JpNUlucm1vVTUzbnMKaWg3WW4yRi9rc2plMTNPVjB4am1tVEJ6STdwQTY1N2FuZ0RIdDVNWGxpbCtDZW9RR09CMTBEbTd3UjZoWUphOAozY2tiaWZlVEpyMy9LT0lWNWNJTGZMbVpJTHpwOXBsQUJYR05mYUJqbll3SGg2TVA2UVBxbUZyN2dLNm1oY3k3CkMyb3dpUW5wQWdNQkFBR2pkVEJ6TUE0R0ExVWREd0VCL3dRRUF3SUZvREFUQmdOVkhTVUVEREFLQmdnckJnRUYKQlFjREFqQU1CZ05WSFJNQkFmOEVBakFBTUI4R0ExVWRJd1FZTUJhQUZDNVZEV3d3SldxQ21hSzJPNjRhaXhNYQozazB1TUIwR0ExVWRFUVFXTUJTQ0VtUnZZMnRsY2kxbWIzSXRaR1Z6YTNSdmNEQU5CZ2txaGtpRzl3MEJBUXNGCkFBT0NBUUVBY0gvVmJPTFZPRlY3Z2c5ZExsNjZkaC9FVGhDc2hySmpGNWtaWGlwMVdDNkdCZFdzVDZDWEJGdmkKYk44S1NGMyt6VGc5cllUMWdGZzY0U1RvMDJiVzlabTZUSmNuczY0ZHJNQXY3bXF5TmxodjgweHJuL2dCdWYregpqSnJKMDRyZGprUit5T3hxN3IwNkpVWitIUCt0bjEwb3JtQWVSWllCb1pMNFFsN0RiUzdzdWhMemFZMWdIOXlxCjBvaG4xMUFmd21uVHVOQ1BiNTM5cmV0dzhHek9BQy92Mk1vclZNaEpwK3BhWGk5bVU3UU1sUzMwVndKcnRub3MKYUZJT2NMV1JkS05wRmxrRlNvdjJOOFBzaHVtMzBPd3o0WVJMZXYvOUhFSXV5L05walJhUEFyVklDRXVuUjlMVQpSUWEvNWZwWWJGdDYzQVlScjd3dTRCYXVpUWVGaUE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
    client-key-data: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBekxmK2YxeXo1Q3dMMUJVY2g5ZklVVzlFdldsREwyZ09QcWVoYjAxVnA1SnhuaU15CkdOSnV1MzY3UVhyZ2Rzb1dralUrMUY3c1N1eTRuZU5rQnJCR3VMMVJBOUx0bzlWZDJka3h6USsrZy9ZamZwWVYKOVV6eFhYc1pETGFoRmI3emFpNWptcmhtSHdDbWkzRjdub29Db055c3k3SWZJd3BZaktqRHFkalpMd0gzaWFHSApGRVk4bEIvd1V2TnhqZ096bTR1U0o2NXFGT2Q1N0lvZTJKOWhmNUxJM3RkemxkTVk1cGt3Y3lPNlFPdWUycDRBCng3ZVRGNVlwZmducUVCamdkZEE1dThFZW9XQ1d2TjNKRzRuM2t5YTkveWppRmVYQ0MzeTVtU0M4NmZhWlFBVngKalgyZ1k1Mk1CNGVqRCtrRDZwaGErNEN1cG9YTXV3dHFNSWtKNlFJREFRQUJBb0lCQUVibUhneXI1VjFMWjlsTwphbkFkYWpIUjBFT3M5ZWl3SitiSkZWNi9zTDkxTjBZbU9FNWlhcGtpdmVWaWtlUngvcmtxR1pWaFBvS0FVenZUCkthd3JWb0xhaGZsR0Rxa2oxdm9BZjMvZVNRUFl0ZGc4VUdTQS9rSjZ4R1VqeHN3S01yRCtXZDZXcUQ5cWNVTnYKelBsT0lMVG5XQ3kvaG9zVEpUR3ByUUhncU83ZkorcWxadzY5Y1BReko4N0ZjellMZGFuWURWZUErZmJoTGp2WApxUE1vcVg5SzJ6OUNIc0lPWkNTbUQwT1NFckxWUVgvVElwOWtiMGlncUVleGR1UHRrOStZZnJjMHA5Z0JsZ0JmCjdvOTFIWmpZTGRRZE9wOFpwalZraU5NRzg0UW9QKzVaS25nc3pjb3ZYeENINFZXb1BqZE43Tzd6M2FOTzZTVVIKaHp2RXRPVUNnWUVBNlo1dzVISXNjY2VZU20vNkxTY3I1U3JRblcvdXJVeXhFbmcxSm0wUlc3WUMyZFEvS0ZGbApnc0hOQXVtYi83Yk9QeHVSYVhwZ3lGS3I0R0ZFSENXaU9PY01CRys3K3JLVFQ4MU50WDhxUUlYWnM3ZUNKd05HClN0bWUybng4aHNJTHRmQ0lPeHBJVWtzcldMOEg4bVY1RTNrc1B2UEFXTnBIUU9jSHFJenhOTE1DZ1lFQTRGVEUKOGs1K3VHZ3ErcjFTU0F6eERWbndSL05ncVVoQytweVF2WU1INHBNakVBSTR3ckFIUFFjWS9UQXZiQktJK042UgpJRE54RmszYXZvQWg2ZDlFK1FCbUFKVUpTbDFBbzR4ZFVsenBGT2U0eFJHSXJOVzhWaC9NODFjUnYwN0EvRURCCjh2bWVCUmtINGFXUUNQRE04bzZ0c2IvWmpHTG5RTExuTks2RjdQTUNnWUVBdUY2RFI3YlhYb0FmcnZkS1lDSWUKNFQvMTNabjlxaVR4UmRzNlR2WWFrZDlGeHJWYmxxME9TTEE3NUVXTENMY3pjOWlFM05KbzJROXRkNm9yZjI4dgo1R3ByTUlFaHdFcjRPUzJVVzExZGNnaHdkQVdxSUxIVDRyUjJTb1dlSFJlOCtEdzR0elFaeVdCcmVDRmkyeWk3CjhlTmFTT0JEZDV2a1NkTktWdm5NVGtNQ2dZRUF4dHhlZWkzN1I1MlAvQlk0Q29idWFOZUJtVWEyT1ZwRmhjT2sKeTFxTWN0M2NCeVR4RENUZlJjbzA3THo2VE9OaGFMeGtDaGVQK0NXcjg1UENmSC9mdEp3VjBBNU4zZzRzYnM3UApLMlFSZXVhdmRJTEdsZkFpdEhZY1NOcTJjTkJ2WXk1RXdBOW5kVDFyTHl5Rk1tZkVSb0VVbUsxcFBIbXdaam94Cm14SGF4dUVDZ1lCMnJFQ29vYWI4TjFVdkh5QmM3WDFzREpLY29HNFdWNVhLQTl4cFNNbWc4Zm5FYVRMSUJMazAKNUhIRy9ONy90bitldWRyZlluQWdWK3ZkeFN4WCsyb084NFE2dnlmZ3FlNjVsZUY2RUduNEN5RE0yVVZFaGJ5MQpwc2RnSFpQOXo0VTBLYlZFK3hJRGgxOEZTOHBEaGVGVW9XWGVLL2ZjZkZxc0hJZTFLb1ZwNXc9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=
`);
const sleep = (second) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(Date.now()), 1000 * second);
  });
};
const s3DeleteHandler = {
  event: "s3-delete",
  handler: async () => {
    const timestamp = await sleep(300);
    console.log("s3 delete handler result: ", timestamp);
  },
};
class EventHandler extends events.EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(1000);
    this.addHandler(s3DeleteHandler.event, s3DeleteHandler.handler);
  }

  addHandler(eventName, handler) {
    console.log(`add handler ${eventName}`);
    const eventNames = this.eventNames();
    if (eventNames.includes(eventName)) {
      console.warn(`the ${eventName} handler has be added!`);
    }
    this.addListener(eventName, () => {
      handler()
        .then(() => {
          console.log(`${eventName} done`);
        })
        .catch((err) => {
          console.log(`${eventName} catch error: ${JSON.stringify(err)}`);
        });
    });
  }

  removeHandler(eventName) {
    this.removeAllListeners(eventName);
  }

  trigger(eventName) {
    console.log(`trigger event ${eventName}`);
    this.emit(eventName);
  }

  getEventCount() {
    this.listenerCount;
  }
}
const eh = new EventHandler();
const app = express();
const port = 3000;
app.use(bodyParser.json());

app.get("/hello", (req, res) => {
  console.log(`[${new Date().toString()}] hello`);
  res.send("Hello World");
});
app.get("/time", (req, res) => res.send(new Date().toString()));
app.post("/post", (req, res) => res.json({ now: new Date().toString() }));
app.post("/pod", async (req, res) => {
  const body = req.body;
  console.log("receive body: %j", body);

  const jobName = `${Date.now()}-job`;
  const job = new k8s.V1Job();
  job.apiVersion = "batch/v1";
  job.kind = "Job";
  job.metadata = {
    name: jobName,
  };
  job.spec = {
    ttlSecondsAfterFinished: 5,
    template: {
      spec: {
        containers: [
          {
            name: jobName,
            image: "ubuntu:jammy",
            command: ["echo", "hello world"],
          },
        ],
        restartPolicy: "Never",
      },
    },
  };
  const batchV1Api = kc.makeApiClient(k8s.BatchV1Api);
  const result = await batchV1Api.createNamespacedJob("tutorial", job);
  res.json(result);
});
app.get("/trigger", async (req, res) => {
  console.log("trigger");
  eh.emit(s3DeleteHandler.event);
  res.end("ok");
});
app.post("/", async (req, res) => {
  console.log("receivedEvent");
  res.end();
  const receivedEvent = HTTP.toEvent({ headers: req.headers, body: req.body });
  console.log(receivedEvent);
  console.log("开始耗时任务");
  const data = req.body;
  const second = data.second ? +data.second : 100;
  console.log({ second });
  await sleep(second);
  console.log("结束耗时任务");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!!`));
