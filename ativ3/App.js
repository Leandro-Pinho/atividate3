import React, {Component} from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import DatePicker from 'react-native-datepicker';
import {Picker} from '@react-native-picker/picker';
import { styles } from './src/estilo';
import moment from 'moment';

const db = SQLite.openDatabase('bancoo12.db');

class Items extends Component {
  state = {
    items: null
  };
  
  componentDidMount(){
    this.update();
  }

  ShowCurrentDate() {
    var currentDate = moment().format("DD-MM-YYYY");
    return currentDate
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
        
        {items.map(({id, done, value, date, prioridade}) => (
          <TouchableHighlight
            key={id}
            onPress = {() => this.props.onPressItem && this.props.onPressItem(id)} 
            style={{margin: 2}}
            >
            <View style={{ backgroundColor: date < this.ShowCurrentDate() ?  `#ff6347` : `#87ceeb`, borderRadius: 12 }}>
              <View style={styles.containertext}>
                <View style={{ backgroundColor: done ? "#1c9963" : `#ffdab9`,  
                               borderRadius: 12,
                               margin: 10,
                               alignItems: 'center',
                               justifyContent: 'center',
                               width: 50,
                               height: 50,
                              }}>
                  <Text style={styles.index}>{id}</Text>
                </View>
                <View style={styles.index1}>
                  <Text >{'\nDescrição: '}{value}{'\nPrazo: '}{date}{'\nPrioridade: '}{prioridade}</Text>
                </View>
              </View>
            </View>
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
    prioridade: null
  };

  selectDate = (date) => {
    this.setState({date: date});
  }

  componentDidMount(){
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS items (id integer primary key not null, done int, value text, prioridade text, date date);`
      );
    });
  }

  
  render(){

    const prioridade = this.state.prioridade;

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Lista de Tarefas</Text>
        <View style={styles.flexRow}>
          <TextInput style={styles.input}
            onChangeText={text => this.setState({ text })}
            placeholder="Informe a tarefa?"
            value={this.state.text}
          />
          </View>
          <View style={styles.flexRow}>
            <Picker 
              selectedValue={this.state.prioridade}
              style={styles.picker}
              onValueChange={ (itemValue) =>
                this.setState({prioridade: itemValue})
              }
            >
              <Picker.Item label="Pequena" value="Pequena" />
              <Picker.Item label="Média" value="Média" />
              <Picker.Item label="Alta" value="Alta" />
            </Picker>
            <Text style={styles.pickertext}>Selecione a Prioridade: {prioridade}</Text>
          </View>      
        <View style={styles.data}>
          <Text style={styles.textdata}>Prazo para fazer:</Text>
          <DatePicker 
            style={{width: 180}}
            date={this.state.date}
            format="DD-MM-YYYY"
            minDate="10-07-2019"
            onDateChange={this.selectDate}
          />
        </View>
        <Button 
          title="Salvar"
          onPress={() => {
            this.add((this.state.text), (this.state.date), (this.state.prioridade))
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

  add(text, date, prioridade){
    if(text === null || text === ""){
      return false
    }

    db.transaction(tx => {
      tx.executeSql(`INSERT INTO items (done, value, date, prioridade) VALUES (0,?,?,?);`, [text, date, prioridade])
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

