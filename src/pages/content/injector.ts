console.log("injector injected");
const ping = () => {
  window.postMessage({ type: "FROM_INJECTOR", question: "Ping" });
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.ping = ping;
