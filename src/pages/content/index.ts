import Browser from "webextension-polyfill";

const injectScript = (filePath: string) => {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("async", "false");
    scriptTag.src = filePath;
    scriptTag.type = "module";
    scriptTag.id = "frontier-inject";
    scriptTag.onload = function () {
      container.removeChild(scriptTag);
    };
    container.insertBefore(scriptTag, container.children[0]);
  } catch (error) {
    console.error("Frontier: Provider injection failed.", error);
  }
};

injectScript(Browser.runtime.getURL("injector.js"));

const port = Browser.runtime.connect({ name: "background" });

setTimeout(() => {
  port.postMessage({ question: "Hi Background" });
}, 1000);

port.onMessage.addListener(function (msg) {
  console.log(msg, "msg content");
  if (msg.answer === "Hi Content")
    setTimeout(() => {
      port.postMessage({ question: "How are you Background" });
    }, 1000);
  else if (msg.answer === "I am good , How are you Content ? ")
    setTimeout(() => {
      port.postMessage({ question: "I am good too" });
    }, 1000);
});

window.addEventListener("message", (event) => {
  if (event.data.type === "FROM_INJECTOR") {
    port.postMessage({ question: event.data.question });
  }
});
