import React, { Component } from "react";
import {
  Platform,
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  CameraRoll,
  ScrollView
} from "react-native";
import { firebaseApp } from "./FireBase";
import RNFetchBlob from "react-native-fetch-blob";
import ImageResizer from "react-native-image-resizer";

//https://facebook.github.io/react-native/docs/cameraroll.html
//https://github.com/joltup/react-native-fetch-blob
export default class ProfilePicture extends Component {
  constructor(props) {
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

  onSubmit() {
    ImageResizer.createResizedImage(
      this.state.currentPhoto,
      200,
      200,
      "JPEG",
      100,
      0,
      null
    )
      .then(response => {
        // response.uri is the URI of the new image that can now be displayed, uploaded...
        // response.path is the path of the new image
        // response.name is the name of the new image with the extension
        // response.size is the size of the new image
        let path = Platform.OS === "android" ? response.uri : response.path;

        this.setState(
          {
            uploading: true
          },
          () => {
            let data = "";
            let filetype = "jpeg";
            RNFetchBlob.fs
              .readStream(
                // file path
                path,
                // encoding, should be one of `base64`, `utf8`, `ascii`
                "base64",
                // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
                // when reading file in BASE64 encoding, buffer size must be multiples of 3.
                4095
              )
              .then(ifstream => {
                ifstream.open();
                ifstream.onData(chunk => {
                  // when encoding is `ascii`, chunk will be an array contains numbers
                  // otherwise it will be a string
                  data += chunk;
                });
                ifstream.onError(err => {
                  console.log("oops", err);
                });
                ifstream.onEnd(async () => {
                  const userId = await AsyncStorage.getItem("dbId");
                  const storageRef = firebaseApp
                    .storage()
                    .ref()
                    .child(userId + "/profilePicture");
                  console.log(data);
                  storageRef.putString(data).then(data => {
                    this.setState(
                      {
                        uploading: false
                      },
                      () => {
                        storageRef.updateMetadata({
                          contentType: "image/" + filetype
                        });
                        RNFetchBlob.fs.unlink(path);
                        this.props.setProfilePicture();
                        this.props.hideModal();
                      }
                    );
                  });
                });
              });
          }
        );
      })
      .catch(err => {
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
        console.log(err);
      });
  }

  getLibraryPhoto() {  
    this.askPermission();
    CameraRoll.getPhotos({
      first: 40,
      assetType: "Photos",
      mimeTypes: ["image/jpeg", "image/jpg"]
    })
      .then(r => {
        this.setState({ photos: r.edges, hideCameraRoll: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  imageClick(url) {
    return () => {
      this.setState({ currentPhoto: url, hideCameraRoll: true });
    };
  }

  askPermission() {
    const requestPermissions = async () => {
      let permissions = [];
      !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)) && permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)) && permissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (permissions.length > 0) {
        try {
          const granted = await PermissionsAndroid.requestMultiple(permissions);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use all");
          } else {
            console.log("Read/Write permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
      
    };
    
    
    if (Platform.OS === "android") {
      requestPermissions();
    }
  }


  render() {
    return (
      <View style={{ alignItems: "center", backgroundColor: "#F5FCFF"}}>
        <View style={{ marginVertical: 30 }}>
          <Text style={styles.modalText}> Change Profile Picture </Text>
        </View>

        <Text style={styles.modalText2}>
          {this.state.currentPhoto === this.props.profPic
            ? "Current Profile Picture"
            : "New Profile Picture"}
        </Text>
        <Image
          style={styles.image}
          resizeMode={"cover"}
          source={{
            uri:
              this.state.currentPhoto ||
              "https://upload.wikimedia.org/wikipedia/commons/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg"
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginRight: 20 }}>
            {this.state.uploading ? (
              undefined
            ) : (
              <View style={styles.buttonContainer}>
                <Button onPress={this.props.hideModal} title="Go Back" color="black"/>
              </View>
            )}
          </View>
          {this.state.uploading ? (
            undefined
          ) : (
            <View style={styles.buttonContainer}>
              <Button
                onPress={this.getLibraryPhoto}
                title="Upload from Library"
                color="black"
              />
            </View>
          )}
        </View>

        <View style={{ marginTop: 30 }}>
          {this.state.hideCameraRoll ? (
            <View style={{backgroundColor: "#F5FCFF", width: screenWidth, height: 200}}></View>
          ) : (
            <ScrollView
              horizontal={true}
              snapToAlignment={"center"}
              centerContent={true}
            >
              {this.state.photos.map((p, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={this.imageClick(p.node.image.uri)}
                  >
                    <Image
                      style={{
                        width: 200,
                        height: 200,
                        marginRight: 5
                      }}
                      resizeMode={"cover"}
                      source={{ uri: p.node.image.uri }}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {this.state.uploading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : this.state.currentPhoto !== this.props.profPic ? (
            <View style={styles.buttonContainer}>
              <Button title="Submit" onPress={this.onSubmit} color="black"/>
            </View>
          ) : (
            undefined
          )}
        </View>
      </View>
    );
  }
}

let screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  image: {
    width: screenWidth / 1.5,
    height: screenWidth / 1.5,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: "#f4511e",
    borderRadius: 75
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  modalText: {
    fontSize: 20
  },
  modalText2: {
    fontSize: 22,
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  buttonContainer: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderStyle: "solid",
    borderWidth: 3,
    borderRadius: 50,
    borderColor: "#f4511e",
  }
});
