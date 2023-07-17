import Browser from "webextension-polyfill";

Browser.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "background");

  port.onMessage.addListener(function (msg) {
    console.log("background", msg);
    if (msg.question === "Hi Background")
      setTimeout(() => {
        port.postMessage({ answer: "Hi Content" });
      }, 1000);
    else if (msg.question === "How are you Background")
      setTimeout(() => {
        port.postMessage({ answer: "I am good , How are you Content ? " });
      });
    else if (msg.question === "Ping")
      setTimeout(() => {
        port.postMessage({ answer: "Pong" });
      });
    else if (msg.question === "Hi Background , from UI")
      setTimeout(() => {
        port.postMessage({ answer: "Hi UI" });
      });
  });
});
