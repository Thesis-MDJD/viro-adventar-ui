import { firebaseApp } from "./FireBase";
import RNFetchBlob from "react-native-fetch-blob";

export default (userId, success, error) => {
  let data = "";
  let pictureStor = firebaseApp.storage().ref().child(userId + "/profilePicture");

  pictureStor.getMetadata()
    .then((metadata) => {
      pictureStor.getDownloadURL().then( (url) => {
        let task = RNFetchBlob.fetch("GET", url)
          .then( (data) => {
            let string = data.data;
            let stringData = string.split(",").map( (item)=> {
              return String.fromCharCode(item);
            }).join("");
            success({
              profilePicture: "data:" + metadata.contentType + ";base64," + stringData
            });
          });
      });
    })
    .catch( err => {
      error(err);
    });
};