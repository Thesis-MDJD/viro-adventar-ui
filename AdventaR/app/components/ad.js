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
      image: undefined
    };

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (place === undefined) {
      return {
        image: undefined
      };
    }
    let place = nextProps.ad === "Starbucks" ? require("./res/starbucks/test.png") : (nextProps.ad === "Ben & Jerry's" ? require("./res/benandjerry/test.png") : require("./res/hackreactor/test.png"));
    
    return {
      image: (<Viro3DObject
        source={require("./res/sign.vrx")}
        resources={[place]}
        position={[0, 0, 0]}
        scale={[0.3, 0.3, 0.3]}
        rotation={[0, 0, 0]}
        type="VRX"/>)
    };
  }

  render() {
    return (
      <ViroARPlane minHeight={0.5} minWidth={0.5} >
        {this.state.image}
      </ViroARPlane>);
  }
}