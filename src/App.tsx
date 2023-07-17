import "./App.css";
import Browser from "webextension-polyfill";

const port = Browser.runtime.connect({ name: "background" });
port.onMessage.addListener(function (msg) {
  console.log(msg, "msg from background");
});
const UI = () => {
  const postMessage = async () => {
    port.postMessage({ question: "Hi Background , from UI" });
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Messenger</h1>
        <div>
          <button onClick={postMessage}>Message from UI</button>
        </div>
      </header>
    </div>
  );
};

export default UI;
