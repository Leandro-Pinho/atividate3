import {StyleSheet} from 'react-native';
import  Constants  from 'expo-constants';

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
      borderBottomWidth: 1,
      borderBottomColor: '#772ea2',
      margin: 20,
      width: 280
    },
    listArea: {
      backgroundColor: '#fff',
      paddingTop: 16
    },
    sectionContainer: {
      marginBottom: 16,
      marginHorizontal: 16,

    },
    sectionHeading: {
      fontSize: 18,
      marginBottom: 8,
  
    }, 
    data: {
      marginTop:10,
      marginBottom: 20,
      marginLeft: 20,
      flexDirection: 'row'
    },
    picker: {
      height: 20,
      width: 50,
    }, 
    pickertext: {
      borderBottomWidth: 1,
      borderBottomColor: '#772ea2',
      width: 250
    },
    textdata: {
      position: 'relative',
      top: 10,
      marginRight: 10
    },
    containertext: {
      flexDirection: 'row',
      marginHorizontal: 20,
    },
    
    index: {
      color: '#fff',
      fontSize: 20,
      
    },
    index1: {
      color: '#fff',
      fontSize: 20,
      bottom: 8,
      left: 10
    }

  });
  
  export {styles};