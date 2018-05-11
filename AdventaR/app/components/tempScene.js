'use strict';

import React, { Component, Text } from 'react';

import {StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroConstants,
  ViroARSceneNavigator,
} from 'react-viro';
import arScene from "./arScene";
import { withNavigation } from 'react-navigation'

class tempScene extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onInitialized} displayPointCloud={true}>
        
      </ViroARScene>
    );
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      console.log(this.props);
      // this.props.sceneNavigator.push(arScene);
    } else if (state == ViroConstants.TRACKING_UNAVAILABLE) {
      
    }
  }
}

export default withNavigation(tempScene);