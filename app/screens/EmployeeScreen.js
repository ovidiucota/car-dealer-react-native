import React from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import { ListItem, Button } from 'react-native-elements';

import RequestService from '../services/requestService';

export default class EmployeeScreen extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      cars: [],
      indicatorVisible: false
    };

    this.createCar = this.createCar.bind(this);
  }
  componentDidMount() {
    new Promise((resolve, reject) => {
      RequestService.get('/all')
        .then((res) => {
          resolve(res);

          let cars = res.map((el) => {
            let obj = Object.assign({}, el);
            obj.key = el.id
            return obj;
          })

          this.setState(() => {
            return {
              cars: [
                ...cars,
              ]
            }
          });
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
  createCar = (car) => {
    this.toggleIndicator();
    new Promise((resolve, reject) => {
      RequestService.post('/addCar', car)
        .then((res) => {
          this.toggleIndicator();
          car.key = Math.floor((Math.random() * 100) + 1);

          this.setState(() => {
            return {
              cars: [
                ...this.state.cars,
                car
              ]
            }
          });
        })
        .catch((err) => {
          this.toggleIndicator();
          console.log('Serve error on addCar')
        })  
    })
  }
  toggleIndicator = () => {
    this.setState(() => {
      return {
        indicatorVisible: !this.state.indicatorVisible
      }
    });
  }
  newCar = () => {
    const createCar = this.createCar;

    this.props.navigation.navigate('AddCarScreen', {createCar});
  }
  handleDelete = (car) => {
    this.toggleIndicator();
    new Promise((resolve, reject) => {
      RequestService.post('/removeCar', car)

        .then((res) => {
          resolve(res);
          this.toggleIndicator();
          
          index = this.state.cars.indexOf(car);
          newCars = this.state.cars;
          newCars.splice(index, 1);
          this.setState(() => {
            return {
              cars: [
                ...newCars
              ]
            }
          });
        })
        .catch((err) => {
          this.toggleIndicator();
          console.log('Server error on delete')
        })
    });
  }
  render() {
    return (
      <View>
        <ActivityIndicator size="small" color="#00ff00" animating={this.state.indicatorVisible}/>
        <FlatList
          data={this.state.cars}
          extraData={this.state}
          renderItem={({item}) => (
            <ListItem roundAvatar
                      //avatar={item.avatar}
                      title={`${item.name} | ${item.type}`}
                      subtitle={`Quantity: ${item.quantity} | Status: ${item.status} `}
                      // onPress={() => this.editMovie(item)}
                      onLongPress={() => this.handleDelete(item)}
            />
          )}
        />
        <Text />
        <Button onPress={this.newCar} title='Add Car'/>
      </View>
    );
  }
}