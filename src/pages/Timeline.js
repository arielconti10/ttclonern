import React, { Component } from 'react'
import socket from 'socket.io-client';
import api from '../services/api';

import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons';

import Tweet from '../components/Tweet';

export default class Timeline extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Timeline",
    headerRight: (
      <TouchableOpacity onPress={() => navigation.navigate('New')}>
        <Icon 
          name="add-circle-outline"
          size={24}
          style={{ marginRight: 20 }}
          color="#4BB0EE"
        />
      </TouchableOpacity>
    )
  });

  state = { 
    tweets: [],
  }

  subscribeToEvents = () => {
    const io = socket('http://localhost:3000');

    io.on("tweet", data => {
      this.setState({ tweets: [data, ...this.state.tweets] })
    })

    io.on('like', data => {
      this.setState({
        tweets: this.state.tweets.map(
          tweet => (tweet._id === data._id ? data : tweet)
        )
      })
    })
  }

  async componentDidMount() {
    this.subscribeToEvents();
    
    const response = await api.get('tweets');

    this.setState({ tweets: response.data })
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList 
          data={this.state.tweets}
          keyExtractor={tweet => tweet._id}
          renderItem={({ item }) => <Tweet tweet={item} />}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#FFF"
  }
})