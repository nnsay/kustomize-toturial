const { httpTransport, emitterFor, CloudEvent } = require("cloudevents");

// Create an emitter to send events to a receiver
const emit = emitterFor(
  httpTransport("http://dev-restnodeapi.tutorial.127.0.0.1.sslip.io/trigger")
);

// Create a new CloudEvent
const ce = new CloudEvent({ type, source, data });

// Send it to the endpoint - encoded as HTTP binary by default
emit(ce);
