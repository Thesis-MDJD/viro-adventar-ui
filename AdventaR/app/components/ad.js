import React, { Component, Text } from "react";

import {
  Viro3DObject,
  ViroARTrackingTargets,
} from "react-viro";

export default class Advertisement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      markerSize: this.props.markerSize || 1,
      places: this.props.places || [],
      latitude: this.props.latitude || "",
      longitude: this.props.longitude || "",
      markerName: this.props.markerName || "hackreactor",
      source: this.props.source || "./res/OrangePeel_v4.vrx"
    };
  }

  render() {
    return (
      <Viro3DObject
        source={require("./res/OrangePeel_v4.vrx")}
        highAccuracyGaze={true}
        position={[0, 2, 0]}
        scale={[0.01, 0.01, 0.01]}
        rotation={[-90, 0, 0]}
        type="VRX"/>);
  }
}

ViroARTrackingTargets.createTargets({
  "hackreactor": {
    source: require("./res/hackreactor.png"),
    orientation: "Up",
    physicalWidth: 1 // real world width in meters
  }
});