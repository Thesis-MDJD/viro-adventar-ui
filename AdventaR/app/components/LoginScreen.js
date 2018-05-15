import React, { Component } from "react";
import { AsyncStorage, Button, StyleSheet, Text, View } from "react-native";
import { AUTH_CLIENT_ID, AUTH_DOMAIN } from "react-native-dotenv";
import Auth0 from "react-native-auth0";
import { firebaseApp } from "./FireBase";
const auth0 = new Auth0({
  clientId: AUTH_CLIENT_ID,
  domain: AUTH_DOMAIN
});

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
  }

  componentDidMount() {
    this._onLogin();
  }

  getUserProfile = (username, email) => {};

  _onLogin = async () => {
    const self = this;
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: "openid profile",
        audience: "https://" + AUTH_DOMAIN + "/userinfo"
      });
      const user = await auth0.auth.userInfo({
        token: credentials.accessToken
      });
      user.nickname = user.nickname.toLowerCase();
      user.name = user.name.toLowerCase();
      await AsyncStorage.setItem("userToken", credentials.idToken);
      await AsyncStorage.setItem("username", user.nickname);
      await AsyncStorage.setItem("email", user.name);
      const dbId = "";
      const userId = this.rootRef
        .child(`Users`)
        .orderByChild("username")
        .equalTo(user.nickname);
      userId.once("value", async snap => {
        let a = snap.exists();
        if (!a) {
          const id = this.rootRef.child("Users").push({
            username: user.nickname,
            email: user.name
          });
          id = id.toString().slice(48);
          await AsyncStorage.setItem("dbId", id);
        } else {
          await AsyncStorage.setItem("dbId", Object.keys(snap.val())[0]);
          const id = await AsyncStorage.getItem("dbId");
        }
        self.props.navigation.navigate("App");
      });
    } catch (error) {
      console.log("login failed", error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>AdventaR</Text>
        <Text>Please log in.</Text>
        <Button onPress={this._onLogin} title={"Log In"} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});
