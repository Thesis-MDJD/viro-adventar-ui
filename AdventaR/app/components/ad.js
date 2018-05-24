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
    if (nextProps.ad === undefined) {
      return {
        image: undefined
      };
    }
    let place = {Starbucks: require("./res/starbucks/test.png"), "Ben & Jerry's": require("./res/benandjerry/test.png"), other: require("./res/hackreactor/test.png")};
    if (nextProps.ad === "Ben & Jerry's") {
      return {
        image: (
          <Viro3DObject
            source={require("./res/sign.vrx")}
            resources={[place[nextProps.ad]]}
            position={[0, 0, 0]}
            scale={[0.3, 0.3, 0.3]}
            rotation={[0, 0, 0]}
            type="VRX"/>)
      };
    } else {
      return {
        image: (<Viro3DObject
          source={require("./res/sign.vrx")}
          resources={[place[nextProps.ad]]}
          position={[0, 0, 0]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 0, 0]}
          type="VRX"/>)
      };
    }
  }

  render() {
    return (
      <ViroARPlane minHeight={0.5} minWidth={0.5} >
        {this.state.image}
        {this.props.ad === "Ben & Jerry's" ? (
          <ViroParticleEmitter
            position={[0, 4.5, 0]}
            duration={2000}
            visible={true}
            delay={0}
            run={true}
            loop={true}
            fixedToEmitter={true}

            image={{
              source:require("./res/snowflake.png"),                 
              height:0.03,
              width:0.03,
              bloomThreshold:1.0
            }}

            spawnBehavior={{
              particleLifetime:[4000,4000],
              emissionRatePerSecond:[150, 200], 
              spawnVolume:{
                shape:"box", 
                params:[20, 1, 20], 
                spawnOnSurface:false
              },
              maxParticles:1600
            }}

            particleAppearance={{
              opacity:{
                initialRange:[0, 0],
                factor:"time",
                interpolation:[
                  {endValue:0.5, interval:[0,500]},
                  {endValue:1.0, interval:[4000,5000]}
                ]
              },

              rotation:{
                initialRange:[0, 360],
                factor:"time",
                interpolation:[
                  {endValue:1080, interval:[0,5000]},
                ]
              },

              scale:{
                initialRange:[[5,5,5], [10,10,10]],
                factor:"time",
                interpolation:[
                  {endValue:[3,3,3], interval:[0,4000]},
                  {endValue:[0,0,0], interval:[4000,5000]}
                ]
              },
            }}

            particlePhysics={{
              velocity:{
              initialRange:[[-2,-.5,0], [2,-3.5,0]]}
            }}
          />) : undefined}
      </ViroARPlane>);
  }
}