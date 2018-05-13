import React, { Component } from "react";
import {
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { AUTH_CLIENT_ID, AUTH_DOMAIN } from "react-native-dotenv";
import Auth0 from 'react-native-auth0';
const auth0 = new Auth0({
  clientId: AUTH_CLIENT_ID,
  domain: AUTH_DOMAIN
});

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._onLogin();
  }

  _onLogin = async () => {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile',
        audience: 'https://' + AUTH_DOMAIN + '/userinfo'
      });
      const user = await auth0.auth.userInfo({token: credentials.accessToken});
      await AsyncStorage.setItem('userToken', credentials.idToken);
      await AsyncStorage.setItem('username', user.nickname);
      await AsyncStorage.setItem('email', user.name);
      this.props.navigation.navigate('App');
    } catch (error) {
      console.log('login failed', error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>AdventaR</Text>
        <Text>
          Please log in.
        </Text>
        <Button
          onPress={this._onLogin}
          title={'Log In'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});
