const {
  WebSocketConnection,
  InspectorBackend
} = require("./src/api");

const defer = require("./src/util/defer");
const jsBootstrap = require("./src/js-bootstrap");
const browserBootstrap = require("./src/browser-bootstrap");

function onConnect(connection) {
  const ws = connection._socket;

  ws.onopen = () => {};
  ws.onmessage = (e) => connection._onMessage(e);
}

function connect(url, { type = "browser"}) {
  let isConnected = false;
  let deferred = defer();

  setTimeout(() => {
    if (isConnected) {
      return;
    }

    deferred.resolve();
  }, 1000);

  return new Promise(resolve => {
    if (type == "browser") {
      browserBootstrap(InspectorBackend);
    } else {
      jsBootstrap(InspectorBackend);
    }

    WebSocketConnection.Create(
      url,
      connnection => {
        isConnected = true;
        onConnect(connnection);
        resolve(connnection);
      }
    );
  });
}

module.exports = {
  connect
};
