import * as firebase from "firebase";
import { FIREBASE_DATABASEURL, FIREBASE_APIKEY, FIREBASE_STORAGEKEY } from "react-native-dotenv";

const firebaseConfig = {
  apiKey: FIREBASE_APIKEY,
  databaseURL: FIREBASE_DATABASEURL,
  storageBucket: FIREBASE_STORAGEKEY
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

/* 

See who my friends are

- Select * from friends where user1 === username || user2 === username



Check my visit history

- Select visit history from users where user is username

See what chat rooms im in

- Select * from conversations where im one of the users

See the messages inside that chatroom

- Select * from messages order by conversation = conversation.id

request friends and accept friends

- Select * from requests where user 1 or user 2 === my user.id

- Select * from friends where user 1 or user 2 === my user.id


*/
