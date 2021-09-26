import React, {Component} from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View, Button } from 'react-native';
import  Constants  from 'expo-constants';
import * as SQLite from 'expo-sqlite';
import DatePicker from 'react-native-datepicker';

const db = SQLite.openDatabase('banco4.db');

class Items extends Component {
  state = {
    items: null
  };
  
  componentDidMount(){
    this.update();
  }

  render(){

    const { done: doneHeading } = this.props;
    const { items } = this.state;
    const heading = doneHeading ? "Concluido" : "Para Fazer";

    if (items === null || items.length === 0){
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>
          {heading}
        </Text>
        {items.map(({id, done, value, date}) => (
          <TouchableHighlight
            
            key={id}
            onPress = {() => this.props.onPressItem && this.props.onPressItem(id)} 
            style={{
              backgroundColor: done ? "#1c9963" : "#cc0000",
              borderColor: "#000",
              borderColor: 1,
              padding: 8
            }}
            >
              
              <Text style={{ color: done ? "#fff" : "#000" }}>{value}{date}</Text>
          </TouchableHighlight>
        ))}
      </View>
    );
  }

  update(){
    db.transaction(tx => {
      tx.executeSql(
      `SELECT * FROM items WHERE done = ?;`,
      [this.props.done ? 1 : 0],
      (_, {rows: { _array } }) => this.setState({ items: _array })
      );
    });
  }

}
export default class App extends Component {
  state = {
    text: null,
    date: '',
  };

  selectDate = (date) => {
    this.setState({date: date});
  }

  componentDidMount(){
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS items (id integer primary key not null, done int, value text);`
      );
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Lista de Tarefas</Text>
        <View style={styles.flexRow}>
          <TextInput style={styles.input}
            onChangeText={text => this.setState({ text })}
            placeholder="O que eu tenho que fazer?"
            value={this.state.text}
          />
          </View>
      
        <View style={{margin: 20}}>
          <Text>Prazo para fazer</Text>
          <DatePicker
            style={{width: 200}}
            date={this.state.date}
            format="DD-MM-YYYY"
            minDate="10-07-2019"
            onDateChange={this.selectDate}
            date={this.state.date}
          />
        </View>
        <Button 
          title="Salvar"
          onPress={() => {
            this.add((this.state.text))
            this.add((this.state.date))
            this.setState({ text:null })
          }}
        />
            
        <ScrollView style={styles.listArea}>
          <Items 
            done={false}
            ref={todo => (this.todo = todo)}
            onPressItem={(id) => 
              db.transaction(
                tx => {
                  tx.executeSql(`UPDATE items SET done = 1 WHERE id = ?;`, [id])
                },null,this.update
              )
            }
          />
          <Items
          done={true}
          ref={done => (this.done = done)}
          onPressItem={(id) =>
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
    if(text === null || text === ""){
      return false
    }

    db.transaction(tx => {
      tx.executeSql(`INSERT INTO items (done, value) VALUES (0,?);`, [text])
      tx.executeSql(`SELECT * FROM items;`, [], (_, {rows}) => console.log(JSON.stringify(rows))
      );
      },null, this.update
    );
  }
  update = () => {
    this.todo && this.todo.update();
    this.done && this.done.update();
  };
}
const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  flexRow: {
    flexDirection: "row"
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: 16
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,

  }
});
