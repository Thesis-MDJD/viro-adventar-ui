import { AppRegistry } from 'react-native';
import App from './App.js';

import { PermissionsAndroid } from 'react-native';


async function requestPermissions() {
  let permissions = [];
  !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)) && permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
  !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) && permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA)
  !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)) && permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
  !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)) && permissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
  if(permissions.length > 0){
    try {
      const granted = await PermissionsAndroid.requestMultiple(permissions)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use all")
      } else {
        console.log("Camera permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  
}

requestPermissions()

AppRegistry.registerComponent('AdventaR', () => App);