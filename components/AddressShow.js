import React, {Component} from 'react'
import { connect } from 'react-redux'
import firebase from "firebase";
import {db} from "../store"; // Firestore用に追加
import Lib from '../static/address_lib';
import Account from '../components/Account';

import Router from 'next/router';


class AddressShow extends Component {
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
      last:-1,
      input:'',
      email:Router.query.email,
      address:null,             // state.address.docId.messages.送信者(from).timestamp.インプット内容、が実際に受信したメッセージ
      message:Router.query.email + 'のデータ' // ただ上部に表示するメッセージ
    }
    this.logined = this.logined.bind(this);
    this.doChange = this.doChange.bind(this);
    this.doAction = this.doAction.bind(this);
  }


  // login,logout処理
  logined(){
    console.log('logined');
  }
  logouted(){
    Router.push('/address');
  }


  // アドレスデータの検索
  /* オリジナルコード
  getAddress(email){
    let db = firebase.database();
    let ref0 = db.ref('address/'
      + Lib.encodeEmail(this.props.email)
      + '/' + Lib.encodeEmail(email) + '/check');
    ref0.set(false);
    let ref = db.ref('address/'
      + Lib.encodeEmail(this.props.email));
    let self = this;
    ref.orderByKey()
      .equalTo(Lib.encodeEmail(email))
      .on('value', (snapshot)=>{
        for(let i in snapshot.val()){
          let d = Lib.deepcopy(snapshot.val()[i]);
          self.setState({
            address:d
          });
          break;
        }
      });
  }
  Firestore向けに書き換え↓*/
  getAddress(email){
    db.collection('address')
        .doc(this.props.email) // 自分自身のcheckをfalseにする
        .update({check: false})

    let datas = [];
    db.collection('address')
        .where('email','==',email)
        .get()
        .then(querySnapshot => {
            const datas = querySnapshot.docs.map(doc => doc.data());
            let d = Lib.deepcopy(datas);
            console.log('■d ' + JSON.stringify(d));
            let self = this;
            self.setState({
                'address': d //address = クリックした人の個人データ詳細
            });
            console.log('■ステートのaddress ' + JSON.stringify(this.state.address));
            console.log('■ステートのaddress.name ' + JSON.stringify(this.state.address[0].name));
           // console.log('■ステートのaddress.messages ' + JSON.stringify(this.state.address[0]['atyahara@gmail_com'].messages));
        }); 
  }


  // フィールド入力
  doChange(e){
    this.setState({
      input:e.target.value
    });
  }


  // メッセージ送信処理
  doAction(){
    let from = this.props.email; // 自分自身のDocId
    let to = this.state.email; // 相手のemailを仮代入
    let d = new Date().getTime();
    let input = this.state.input;
/*
    let ref = db.ref('address/' + from + '/' + to
      + '/messages/' + d);
    ref.set('to: ' + this.state.input);
    let ref2 = db.ref('address/' + to + '/' + from
      + '/messages/' + d);
    ref2.set('from: ' + this.state.input);
    let ref3 = db.ref('address/' + to + '/' + from
      + '/check/');
    ref3.set(true);
  Firestore向けに書き換え↓*/
    db.collection('address').where('email','==',to) // to = 送信相手のemail
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const ref = db.collection('address').doc(from); // 自分Doc
          const ref2 = db.collection('address').doc(doc.id); // 相手Doc. Snapshotからdoc.idでdocIdが取得できる
          console.log('◆自分のdoc.id '+ from)
          console.log('◆相手のdoc.id '+ doc.id);
          console.log('◆state.inputは'+ input); // 直でthis.state.inputとするとなぜかカラ.
         to = Lib.encodeEmail(doc.id); // 相手のDocIdをエンコード
         from = Lib.encodeEmail(from); // 自分のDocIdをエンコード
         let me = this.props.username;
         console.log('▲' + me); // me = 自分のGoogleアカウント名
          ref.update({
            [`${to}.messages.${d}`] : me + ' wrote :' + input   // 自分Doc配下に“messages/エンコード化相手アドレス/timestamp: メッセージ内容” で保存  
          })
          ref2.update({
            [`${from}.messages.${d}`] : me + ' wrote :' + input,  // 相手Doc配下に“messages/エンコード化自分アドレス/timestamp: メッセージ内容” で保存 
            check: true 
          });          
        })
      })

    this.setState({ input:''})
  }


  // レンダリング
  render(){
    if (this.state.address == null){ //address = クリックした人の個人データ詳細
      this.getAddress(Router.query.email);
    }
    let items = [];
    
    if (this.state.address != null){
      let from = Lib.encodeEmail(this.props.email);
      console.log('◆◆fromは '+ from);
      if (this.state.address[0][from]['messages'] != null) {
        console.log('◆◆state.address.messagesちゃん '+ JSON.stringify(this.state.address[0][from]['messages']))
        let JSONobj = this.state.address[0][from]['messages'];
        console.log('◆◆JSONobj '+ JSONobj)
        console.log('◆◆Json長さ　' + Object.keys(JSONobj).length);
        for(let item in JSONobj){ //クリックした人とのやりとりメール一覧
            console.log('◆◆'+ item + ': ' + JSONobj[item])
          items.unshift(<li key={item}>
            {JSONobj[item]}
          </li>);
        }
      } else { return; }
    }
    
    return (
      <div>
        <Account onLogined={this.logined}
          onLogouted={this.logouted} />
        <p>{this.state.message}</p>
        <hr/>
        {this.state.address != null
        ?
        <table>
          <tbody>
            <tr>
              <th>NAME</th>
              <td>{this.state.address[0].name}</td>
            </tr>
            <tr>
              <th>MAIL</th>
              <td>{this.state.email}</td>
            </tr>
            <tr>
              <th>TEL</th>
              <td>{this.state.address[0].tel}</td>
            </tr>
            <tr>
              <th>MEMO</th>
              <td>{this.state.address[0].memo}</td>
            </tr>
          </tbody>
        </table>
        :
        <p>no-address</p>
        }
        <hr />
        <fieldset>
          <p>Message:</p>
          <input type="text" size="40"
            value={this.state.input}
            onChange={this.doChange} />
          <button onClick={this.doAction}>send</button>
        </fieldset>
        {this.state.address != null
//         &&
//         this.state.address[0][Lib.encodeEmail(this.props.email)]['messages'] != null
        ?
        <div>
        <p>※{this.state.address[0].name}さんとのメッセージ</p>
        <ul>{items}</ul>
        </div>
        :
        <p>※メッセージはありません。</p>
        }
      </div>
    );
  }


}
AddressShow = connect((state)=> state)(AddressShow);
export default AddressShow;