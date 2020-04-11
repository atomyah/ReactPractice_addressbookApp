import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import firebase from "firebase";
import "firebase/firestore"; // Firestore用に改変追加
import { firebaseConfig } from './.config';


// Firebase設定 ← .config.jsに分離
// Firebase初期化
var fireapp;
try {
    fireapp = firebase.initializeApp(firebaseConfig);
} catch (error) {
  console.log(error.message);
}
export default fireapp;
const db = firebase.firestore(); // Firestore用に追加
export { db }; // Firestore用に追加


// ステート初期値
const initial = {
  login:false,
  username:'(click here!)',
  email:'',
  data:[],
  items:[]
}


// レデューサー
function fireReducer(state = intitial, action) {
  switch (action.type) {
    // ダミー
    case 'UPDATE_USER':
      return action.value;
    // デフォルト
    default:
      return state;
  }
}


// initStore関数
export function initStore(state = initial) {
  return createStore(fireReducer, state,
    applyMiddleware(thunkMiddleware))
}
