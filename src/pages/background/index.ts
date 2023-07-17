import Browser from "webextension-polyfill";

Browser.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "background");
  port.onMessage.addListener(function (msg) {
    if (msg.question === "Hi Background")
      port.postMessage({ answer: "Hi Content" });
    else if (msg.question === "How are you Background")
      port.postMessage({ answer: "I am good , How are you Content ? " });
    else if (msg.question === "Ping") port.postMessage({ answer: "Pong" });
    else if (msg.question === "Hi Background , from UI")
      port.postMessage({ answer: "Hi UI" });
  });
});
