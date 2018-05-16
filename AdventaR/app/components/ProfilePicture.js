import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage,
  Modal,
  TouchableHighlight,
  CameraRoll,
  ScrollView,
} from "react-native";
import { firebaseApp } from "./FireBase";

//https://facebook.github.io/react-native/docs/cameraroll.html
export default class ProfilePicture extends Component {
  constructor(props){
    super(props);

    this.state = {
      photos: [],
      currentPhoto: this.props.profPic,
      hideCameraRoll: false
    };

    this.imageClick = this.imageClick.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  handleButtonPress() {
    CameraRoll.getPhotos({
        first: 40,
        assetType: 'Photos',
      })
      .then(r => {
        console.log(r.edges);
        this.setState({ photos: r.edges, hideCameraRoll: false });
      })
      .catch((err) => {
        
      });
  }

  imageClick(url){
    return () => {
      this.setState({ currentPhoto: url, hideCameraRoll: true })
    }
  }

  render() {
    return (
      <View >
        <View style={{marginBottom: 30}}>
          <Text style={styles.modalText}> Change Profile Picture </Text>
        </View>
        <View style={{alignItems: "center"}}>
          <Text style={styles.modalText}>New Picture</Text>
          <Image
            style={styles.image}
            resizeMode={'cover'}
            source={{
              uri: this.state.currentPhoto || "https://upload.wikimedia.org/wikipedia/commons/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg"
            }}
          />
          <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
            <Button style={{marginRight: 20}} onPress={this.props.hideModal} title="Go Back" />
            <Button onPress={this.handleButtonPress} title="Upload from Library" />
          </View>
          
          {this.state.hideCameraView ? (this.state.currentPhoto !== this.props.profPic && (
          <Button style={{alignItems: "center", margin:auto}} />
            )) : (
          <ScrollView 
          style={marginTop = 10}
          horizontal={true}
          snapToAlignment={'center'}
          centerContent={true}
          >
            {this.state.photos.map((p, i) => {
            return (
              <TouchableHighlight key={i} onPress={this.imageClick(p.node.image.uri)}>
                <Image
                  style={{
                    width: 200,
                    height: 200,
                    marginRight:5
                  }}
                  resizeMode={'cover'}
                  source={{ uri: p.node.image.uri }}
                />
              </TouchableHighlight>
            );
          })}
          </ScrollView>)}
          
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  modalText:{
    fontSize: 20,
  }
});