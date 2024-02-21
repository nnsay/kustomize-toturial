const { httpTransport, emitterFor, CloudEvent } = require("cloudevents");

// Create an emitter to send events to a receiver
const emit = emitterFor(
  httpTransport("http://dev-restnodeapi.tutorial.127.0.0.1.sslip.io")
);

// Create a new CloudEvent
const ce = new CloudEvent({
  type: "dev.knative.docs.sample",
  source: "source/localhost",
  data: {
    hello: "world",
  },
});

// Send it to the endpoint - encoded as HTTP binary by default
emit(ce)
  .then((responseSink) => {
    console.log(`Sent event: ${JSON.stringify(ce, null, 2)}`);
    console.log(
      `K_SINK responded: ${JSON.stringify(
        {
          status: responseSink.status,
          headers: responseSink.headers,
          data: responseSink.data,
        },
        null,
        2
      )}`
    );
  })
  .catch(console.error);
