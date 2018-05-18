import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
  CameraRoll,
  ScrollView,
} from "react-native";
import { firebaseApp } from "./FireBase";
import RNFetchBlob from "react-native-fetch-blob";

//https://facebook.github.io/react-native/docs/cameraroll.html
//https://github.com/joltup/react-native-fetch-blob
export default class ProfilePicture extends Component {
  constructor(props){
    super(props);

    this.state = {
      photos: [],
      currentPhoto: this.props.profPic,
      hideCameraRoll: true,
      uploading: false
    };

    this.imageClick = this.imageClick.bind(this);
    this.getLibraryPhoto = this.getLibraryPhoto.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(){
    this.setState({
      uploading: true
    }, () => {
      let data = "";
      RNFetchBlob.fs.stat(this.state.currentPhoto)
        .then((stats) => {
          let filetype = stats.filename.split(".")[1];
          console.log(filetype);
          RNFetchBlob.fs.readStream(
            // file path
            this.state.currentPhoto,
            // encoding, should be one of `base64`, `utf8`, `ascii`
            "base64",
            // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
            // when reading file in BASE64 encoding, buffer size must be multiples of 3.
            4095)
          .then((ifstream) => {
            ifstream.open()
            ifstream.onData((chunk) => {
              // when encoding is `ascii`, chunk will be an array contains numbers
              // otherwise it will be a string
              data += chunk
            })
            ifstream.onError((err) => {
              console.log("oops", err)
            })
            ifstream.onEnd(async () => {
              const userId = await AsyncStorage.getItem("dbId");
              const storageRef = firebaseApp.storage().ref().child(userId + "/profilePicture")

              storageRef
              .putString(data)
              .then( (data) => {
                  this.setState({
                    uploading: false
                  }, () => {
                    storageRef.updateMetadata({ contentType: 'image/' + filetype })
                    this.props.setProfilePicture();
                    this.props.hideModal();
                  })
                });
            });
          });
        })
        .catch((err) => {
          console.log(err);
        })
      
    })
    
  }

  getLibraryPhoto() {
    CameraRoll.getPhotos({
        first: 40,
        assetType: "Photos"
      })
      .then(r => {
        this.setState({ photos: r.edges, hideCameraRoll: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  imageClick(url){
    return () => {
      this.setState({ currentPhoto: url, hideCameraRoll: true })
    }
  }


  render() {
    return (
      <View style={{alignItems: "center"}}>
        <View style={{marginBottom: 30}}>
          <Text style={styles.modalText}> Change Profile Picture </Text>
        </View>
        
        <Text style={styles.modalText}>{this.state.currentPhoto === this.props.profPic ? "Current Profile Picture" : "New Profile Picture"}</Text>
        <Image
          style={styles.image}
          resizeMode={"cover"}
          source={{
            uri: this.state.currentPhoto || "https://upload.wikimedia.org/wikipedia/commons/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg"
          }}
        />
        
        <View style={{flexDirection:"row", alignItems: "center"}}>
          <View style={{marginRight: 20}}>
            {this.state.uploading ? undefined : (<Button onPress={this.props.hideModal} title="Go Back" />) }
          </View>
          {this.state.uploading ? undefined : (<Button onPress={this.getLibraryPhoto} title="Upload from Library" />) }
        </View>
        
        <View style={{marginTop: 30}}>
          {this.state.hideCameraRoll ? (undefined) : (
          <ScrollView 
          horizontal={true}
          snapToAlignment={"center"}
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
                  resizeMode={"cover"}
                  source={{ uri: p.node.image.uri }}
                />
              </TouchableHighlight>
            );
          })}
          </ScrollView>)}
        
        {this.state.uploading ? (<ActivityIndicator size="large" color="#0000ff" />) : (this.state.currentPhoto !== this.props.profPic ? (
          <View>
            <Button title="Submit" onPress={this.onSubmit} />
          </View>)
           : (undefined))}
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
  center: {
    alignItems:"center",
    justifyContent:"center"
  },
  modalText:{
    fontSize: 20,
  }
});