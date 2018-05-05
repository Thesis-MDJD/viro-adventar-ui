import { AppRegistry } from "react-native";
import App from "./app/App.js";

if (__DEV__) {
  require("react-devtools");
}
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);

AppRegistry.registerComponent("AdventaR", () => App);

// The below line is necessary for use with the TestBed App
AppRegistry.registerComponent("ViroSample", () => App);
