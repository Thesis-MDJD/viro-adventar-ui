import { firebaseApp } from "./FireBase";
import ProfilePicture from "./ProfilePicture";
import RNFetchBlob from "react-native-fetch-blob";

export default (userId, success, error) => {
  let data = "";
  firebaseApp.storage().ref().child(userId + "/profilePicture.jpeg").getDownloadURL().then( (url) => {
    let task = RNFetchBlob.fetch("GET", url)
      .then( (data) => {
        let string = data.data;
        let stringData = String.fromCharCode(...string.split(","));
        success("data:image/jpeg;base64," + stringData);
      })
      .catch( err => {
        error(err);
      });
  });
};