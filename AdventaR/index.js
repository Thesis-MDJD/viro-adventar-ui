import { AppRegistry, YellowBox, Platform, PermissionsAndroid } from "react-native";
import App from "./app/App.js";

if (__DEV__) {
  require("react-devtools");
}

console.disableYellowBox = true;

AppRegistry.registerComponent("AdventaR", () => App);

// The below line is necessary for use with the TestBed App
// AppRegistry.registerComponent("ViroSample", () => App);
