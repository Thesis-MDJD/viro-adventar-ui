import React, { Component, Text } from "react";

import {
  Viro3DObject,
  ViroARPlane,
  ViroParticleEmitter,
  ViroAmbientLight,
} from "react-viro";
import getDegreesDistance from "./util/getDegreesDistance";
import RNFetchBlob from "react-native-fetch-blob";

export default class Advertisement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      places: this.props.places || [],
      latitude: this.props.latitude || "",
      longitude: this.props.longitude || "",
      image: this.props.place && this.getAd(this.props.place.ad)
    };

    var ads = {benandjerry: require("./res/benandjerry/test.png"), hackreactor: require("./res/hackreactor/test.png"), starbucks: require("./res/starbucks/test.png")}
  }

  getAd(place) {
    console.log(require("./res/test.png"));
    this.setState({
      image: (<Viro3DObject
        source={require("./res/sign.vrx")}
        resources={ads[place] || ads["hackreactor"]}
        position={[0, 0, 0]}
        scale={[0.3, 0.3, 0.3]}
        rotation={[0, 0, 0]}
        type="VRX"/>)
    });
  }

  componentDidMount() {
  }

  render() {
    return (
      <ViroARPlane minHeight={0.5} minWidth={0.5} >
        {this.state.image}
      </ViroARPlane>);
  }
}