class Lib{
  /*
  Firestoreではドット(.)の入力がOKなのでemailのエンコード・デコードいらない
  */
    static deepcopy(val){
      return JSON.parse(JSON.stringify(val));
    }
  /*
  ただ各個人のmessages配下にemailアドレスをネストするとき
  [`messages.${to}.${d}`]のようにドットで区切るのでemailのドットが邪魔になる.
  例えば,atom@yah.co.jpだとatom@yah / co / jp のようにネストされてしまう.
  そしてアスタリスク*はフィールド値に使えないときた.
　なのでアンダーバー_に変えた.
  */
    static encodeEmail(val){
      return val.split(".").join("_"); 
    }
    static decodeEmail(val){
      return val.split("_").join(".");
    }
}

export default Lib;