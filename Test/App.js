
import React, {Component} from 'react';
import {Platform,Modal,Dimensions,StyleSheet,TouchableHighlight,TouchableWithoutFeedback,Alert,ActivityIndicator,Text,View,Image,Button } from 'react-native';
import {createStackNavigator} from 'react-navigation';

const instructions = Platform.select({
  ios: 'IOS',
  android:'Я не Андрей, я - ANDROID',
});

type Props = {};

class HomeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state={isLoading:true};
  }  
    
  setModalImage(imagekey){
    let modalSrc={uri:this.state.dataSource[imagekey].fullphoto};
    this.props.navigation.navigate('Details',{modalImage:modalSrc});
  }

  componentDidMount(){
    return fetch("https://api.unsplash.com/photos/?client_id=cf49c08b444ff4cb9e4d126b7e9f7513ba1ee58de7906e4360afc1a33d1bf4c0")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.map(function(item){
                      return {
                        'name':item.user.name,
                        'photo':item.urls.thumb,
                        'fullphoto':item.urls.full
                      }
                    }),
                });
              })
      .catch((error) =>{
        Alert.alert(error);
      });
  }


  
  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <Text style={styles.welcome}>Welcome to React Native application!</Text>
          <Text style={styles.instructions}>{instructions}</Text>
          <ActivityIndicator/>
        </View>
      )
    }

    let images = this.state.dataSource.map((val,key)=>{
    let src={uri:val.photo};
    return <TouchableWithoutFeedback key={key}
              onPress={()=>{this.setModalImage(key)}}>
              <View style={styles.card}>                  
                <Image source={src} style={styles.image}/>
                <View style={styles.info}> 
                  <Text style={styles.name}>{val.name}</Text>
                  <Text style={styles.text}>Some description</Text> 
                </View>                
              </View>
            </TouchableWithoutFeedback>
    });


    return (
      <View style={styles.container}>
         {images}
      </View> 
    );
  }
}

class DetailsScreen extends React.Component {  

  render() {
    const {navigation} = this.props;
    const sourceUri = navigation.getParam('modalImage', 'empty');

    return (
      <View style={styles.modal}>

          <TouchableHighlight style={styles.modal} onPress={() => this.props.navigation.navigate('Home')}>
            <View  style={styles.modal}>
              <Image  source={sourceUri} style={styles.modal}></Image>
            </View>
          </TouchableHighlight>  

      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack/>;
  }
}

const styles = StyleSheet.create({
  container:{
    marginTop:20,
    flex:4,
    flexDirection:'column',
    bacgroundColor: "#eee",
    alignContent:"space-around",
  },
  card:{
    flex:4,
    flexDirection:'row',
    alignItems:'center',
    margin:5,
    backgroundColor:'darkgrey',
    overflow:'hidden'
  },
  image:{
    flex:1,   
    height: (Dimensions.get('window').height/15),
  },
  info:{
    color:'red',    
    flex:4,
    padding: 10,   
  },  
  name:{
    fontSize:20,
    color:'red',
  },
  text:{
    fontSize:14,
    color:'yellow',
  },
  modal:{
    flex:1,
    backgroundColor:"rgba(0,0,0,0)",
  },
  
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});