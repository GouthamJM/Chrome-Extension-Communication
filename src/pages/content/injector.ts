console.log("injected to injector");
const ping = () => {
  window.postMessage({ type: "FROM_INJECTOR", question: "Ping" });
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.ping = ping;
