# Browser Extension Message Passing

A Browser extension is a small software program that extends the functionality of the Browser.

They can interact with web pages, access browser APIs, and modify the browser's behaviour. From blocking ads and improving privacy to adding productivity tools and integrating with external services, the possibilities of what can be achieved with extensions are vast.

The Browser Extension API provides developers with a set of tools and APIs to interact with the browser and build powerful extensions.

The architecture of extension is quite different from traditional web applications , Browser gives a lot of powerful APIs , like as said with “great power comes great responsibility” , managing the security and message passing efficiently becomes important part of it .

There are three different messaging APIs

1. **Simple one time message** 

2. **Long-lived connection message**

3. **Native Message ( Messaging to Desktop Apps )**

In this blog , we will explore how you can pass messages between different modules with **Long-lived connection message** . The different modules are as follows:

1. **Extension UI** : The user interface elements that are displayed to the user. These components can be used to provide a visual representation of the extension's functionality or to interact with the user.
2. **Background Service Worker** : This run in the background and have access to the full range of Browser extension APIs. They can be used to perform tasks such as listening for events, making network requests, and manipulating tabs and windows.
3. **Content Script** : This file is used to enhance the extension’s functionality or customize its appearance.
4. **Injector Script** : load scripts or CSS that can modify the appearance and functionality of the site.

The below diagram is a basic architecture of extension 

![Chrome Extension Architecture.png](Browser%20Extension%20Message%20Passing%20d307e3d320b34bba8eaac9020b71afd9/Chrome_Extension_Architecture.png)

  There will be different requirement to communicate b/w different modules:

1. **Content Script** and **Background**
2. **UI Layer** and **Background**
3. **Injector** (via Content Script) and **Background**

Background Module , should handle business login , which will help you maintain functionality and security . As no other extension ,web page and script can interact with this module than your application.

This [repo](https://github.com/GouthamJM/Chrome-Extension-Communication) , contains the extension code to showcase these modules build with react , Vite for bundling . 

1. **Content Script and Background** :
    
     You can establish a communication b/w these two modules with **Browser.runtime.connect** API with methods**.**
    
    ```jsx
    // content.js 
    
    const port = Browser.runtime.connect({ name: "background" });
    
    port.postMessage({ question: "Hi Background" });
    
    port.onMessage.addListener(function (msg) {
      console.log(msg,'msg')
    	// 
    });
    ```
    
      ****
    
    ```jsx
    // background.js
    
    Browser.runtime.onConnect.addListener(function (port) {
      port.onMessage.addListener(function (msg) {
        if (msg.question === "Hi Background")
          port.postMessage({ answer: "Hi Content" });
      });
    });
    ```
    
    [Screen Recording 2023-07-17 at 4.05.54 PM.mov](Browser%20Extension%20Message%20Passing%20d307e3d320b34bba8eaac9020b71afd9/Screen_Recording_2023-07-17_at_4.05.54_PM.mov)
    
2. **UI Layer** and **Background** :
    
     The communication b/w of these two modules can be established in the same way as the above with **Browser.runtime.connect.**
    
    ```jsx
    // App.jsx
    
    const port = Browser.runtime.connect({ name: "background" });
    
    port.onMessage.addListener(function (msg) {
      console.log(msg);
    // Hi UI , 
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
    ```
    
    ```jsx
    // background.js
    
    Browser.runtime.onConnect.addListener(function (port) {
      port.onMessage.addListener(function (msg) {
        if (msg.question === "Hi Background , from UI")
          port.postMessage({ answer: "Hi UI" });
      });
    });
    ```
    
    [Screen Recording 2023-07-17 at 4.14.09 PM.mov](Browser%20Extension%20Message%20Passing%20d307e3d320b34bba8eaac9020b71afd9/Screen_Recording_2023-07-17_at_4.14.09_PM.mov)
    
3. **Injector** (via Content Script) and **Background :** 
    
     The injector script cannot directly communicate to background due to security concern, as a script can be injected by any external third party, but we can establish a connection via content script , we will give data to content script it will forward it to background **.**
    
    We can communicate from injector to background via **window.postMessage** and **event listener ( window.addEventListener )**
    
    ```jsx
    // injector.js
    console.log("injector injected");
    const ping = () => {
      window.postMessage({ type: "FROM_INJECTOR", question: "Ping" });
    };
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.ping = ping;
    ```
    
    ```jsx
    // content.js
    
    // function to inject script
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
    
    // forward data to background
    window.addEventListener("message", (event) => {
      if (event.data.type === "FROM_INJECTOR") {
        port.postMessage({ question: event.data.question });
      }
    });
    ```
    
    [Screen Recording 2023-07-17 at 4.17.57 PM.mov](Browser%20Extension%20Message%20Passing%20d307e3d320b34bba8eaac9020b71afd9/Screen_Recording_2023-07-17_at_4.17.57_PM.mov)
    

      

In the next blog , we can explore how we can write a scalable communication layer which can be used to build secure and scalable data storage applications .