import React, {Component} from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import firebase from "firebase";
import Lib from '../static/address_lib';
import Account from '../components/Account';
import {db} from "../store"; // Firestore用に追加

class AddressAdd extends Component {
  style = {
    fontSize:"12pt",
    padding:"5px 10px"
  }


  constructor(props) {
    super(props);
    if (this.props.login == false){
      Router.push('/address');
    }
    this.state = {
     name:'',
     email:'',
     tel:'',
     memo:'',
     message:'データを入力して下さい。'
    }
    this.logined = this.logined.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeTel = this.onChangeTel.bind(this);
    this.onChangeMemo = this.onChangeMemo.bind(this);
    this.doAction = this.doAction.bind(this);
  }


  // login,logout処理
  logined(){
    console.log('logined.');
  }
  logouted(){
    Router.push('/address');
  }


  // フィールド入力処理
  onChangeName(e){
    this.setState({name:e.target.value});
  }
  onChangeEmail(e){
    this.setState({email:e.target.value});
  }
  onChangeTel(e){
    this.setState({tel:e.target.value});
  }
  onChangeMemo(e){
    this.setState({memo:e.target.value});
  }


  // データの登録処理
  doAction(e){
    let key = this.state.email;
    let data = {
      check:false, // 追加. これないとFirestoreにcheckフィールドできない
      name:this.state.name,
      email:this.state.email, // Firestore用に追加
      tel:this.state.tel,
      memo:this.state.memo
    }
    /* 
    let db = firebase.database();
    let ref = db.ref('address/'
      + Lib.encodeEmail(this.props.email) + '/'
      + Lib.encodeEmail(this.state.email));
    console.log(ref);
    ref.set(data);
    */　　// Firestore用に改変↓
    const ref = db.collection('address').doc(this.props.email);
    console.log(ref);
    ref.set(data);
    this.setState({
      name:'',
      email:'',
      tel:'',
      memo:'',
      message:'※登録しました。'
    })
  }


  // レンダリング
  render(){
  return (
    <div>
      <Account self={this} onLogined={this.logined}
        onLogouted={this.logouted} />
      <hr/>
      <p>{this.state.message}</p>
      {this.props.login
      ?
      <table>
        <tbody>
          <tr>
            <th>name:</th>
            <td><input type="text" size="30"
              value={this.state.name}
              onChange={this.onChangeName}/></td>
          </tr>
          <tr>
            <th>email:</th>
            <td><input type="text" size="30"
              value={this.state.email}
              onChange={this.onChangeEmail} /></td>
          </tr>
          <tr>
            <th>tel:</th>
            <td><input type="text" size="30"
              value={this.state.tel}
              onChange={this.onChangeTel} /></td>
          </tr>
          <tr>
            <th>memo:</th>
            <td><input type="text" size="30"
              value={this.state.memo}
              onChange={this.onChangeMemo} /></td>
          </tr>
          <tr>
            <th></th>
            <td><button onClick={this.doAction}>
              Add</button></td>
          </tr>
        </tbody>
      </table>
      :
      <p>please login...</p>
      }
    </div>
    );
  }
}


AddressAdd = connect((state)=> state)(AddressAdd);
export default AddressAdd;