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

  _onLogin = () => {
    const component = this;
    auth0.webAuth
      .authorize({
        scope: 'openid profile',
        audience: 'https://' + AUTH_DOMAIN + '/userinfo'
      })
      .then(credentials => {
        component._signInAsync(credentials.accessToken);
      })
      .catch(error => console.log('login failed', error));

  };

  _signInAsync = async (token) => {
    await AsyncStorage.setItem('userToken', token);
    this.props.navigation.navigate('App');
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
