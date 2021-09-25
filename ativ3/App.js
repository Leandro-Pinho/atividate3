import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { constants } from 'expo-constants';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('banco.sqlite');

class Items extends React.Component {
  state = {
    items: null
  }
  
  componentDidMount(){
    this.update();
  }

  render(){

    const { done: doneHeading } = this.props;
    const { items } = this.state;
    const heading = doneHeading ? "Concluido" : "Para Fazer";

    if (items === null || items.length === 0){
      return null
    }

    return (
      <View style={styles.container}>
        <Text>{heading}</Text>
        {Items.map(({id, done, value}) => (
          <TouchableHighlight
            key={id}
            onPress = {this.props.onPressItem && this.props.onPressItem(id)} >
              <Text>{value}</Text>
          </TouchableHighlight>
        ))}

      </View>
    );
  }

  update(){
    db.transaction(tx => {
      `SELECT * FROM items WHERE done = ?;`,
      [this.props.done ? 1 : 0],
      (_, {rows: { _array }}) => this.setState({items: _array})
    })
  }

}
export default class App extends React.Component {
  state = {
    texto: null
  }

  componentDidMount(){
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id integer primary key not null, done int, value text);'
      )
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <Text>Lista de afazeres</Text>
        <View>
          <TextInput style={styles.input}
            onChangeText={text => this.setState({texto: text})}
            value={this.state.texto}
            onSubmitEditing={() => {
              this.add(this.state.texto)
              this.setState({texto:null})
            }}
          />
        </View>
        <ScrollView>
          <Items 
            done={false}
            ref={todo => (this.todo = todo)}
            onPressItem={id => 
              db.transaction(
                tx => {
                  tx.executeSql(`UPDATE items SET done = 1 WHWRE id = ?;`, [id])
                },null,this.update
              )
            }
          />
          <Items
          done={true}
          ref={done => (this.done = done)}
          onPressItem={id =>
            db.transaction(tx => {
              tx.executeSql(`DELETE FROM items WHERE id = ?;`, [id])
            },null,this.update
            )
          }
          />
        </ScrollView>
      </View>
    )
  }

  add(text){
    if(text === null || text === ''){
      return false
    }

    db.transaction(tx => {
      tx.executeSql(`INSERT INTO items (done, value) VALUE (0,?);`, [text])
    
      tx.executeSql(`SELECT * FROM items;`, [], (_, {rows}) => console.log(JSON.stringify(rows))
      )
      },null, this.update
    )
  }
  update = () => {
    this.todo && this.todo.update();
    this.done && this.todo.update();
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 10,
    color: '#772ea2',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#772ea2',
  },
});
