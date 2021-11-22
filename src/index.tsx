import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { Route } from "react-router";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const App = lazy(() => import("./App"));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading App...</div>}>
      <Router>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </Router>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
