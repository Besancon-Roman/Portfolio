import "./images/favicon.ico";
import "./stylesheets/style.css";
import App from "./scripts/myapp.js";

//Accepte le HMR
if (module.hot) {
  module.hot.accept();
}

let init = ( () => {
    let app = new App(document);
    app.launch();
})();

addEventListener("DOMContentLoaded", init);