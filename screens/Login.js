/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
	StyleSheet,
	ScrollView,
	View,
    Text,
    TextInput,
    Button,
    Alert
} from 'react-native';

import { SafeAreaView } from 'react-navigation';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null
        }

    }

    static navigationOptions = {
        header: null
    }

    onLoginPress = () => {

        let payload = new FormData
        payload.append('username', this.state.username)
        payload.append('password', this.state.password)

        fetch("http://192.168.1.7:9090/api/auth", {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: payload,
        })
        .then(res => res.json())
        .then(Response => {
            if ( Response.status === 'success' ) {
                this.props.navigation.replace('Scan')
            } else {
                Alert.alert("Error", Response.error.message)
            }
        })
    }

    render = () => {
        return(
            
            <SafeAreaView>
                <View style={ styles.container }>

                    <View style={ styles.headerTextWrapper }>
                        <Text style={ styles.heading }>SCHMS</Text>
                        <Text style={ styles.tagLine }>David Silva M.M.V</Text>
                    </View>

                    <Text style={ styles.inputLabel }>Username</Text>
                    <TextInput style={ styles.input } onChangeText={(username) => this.setState({username})} />

                    <Text style={ styles.inputLabel }>Password</Text>
                    <TextInput style={ styles.input } secureTextEntry={true} onChangeText={(password) => this.setState({password})} />

                    <Button
                        title="Sign In"
                        onPress={() => this.onLoginPress() }
                    />

                </View>
            </SafeAreaView>

        )
    }

}

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 30
    },

    headerTextWrapper: {
        marginBottom: 100,
    },

    heading: {
        marginTop: 150,
        marginBottom: 5,
        fontSize: 35,
        color: '#000000'
    },

    tagLine: {
        fontSize: 18,
        color: '#9c9c9c'
    },

    inputLabel: {
        color: '#7C7C7C'
    },

    input: {
        height: 50,
        alignSelf: 'stretch',
        borderWidth: 2,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#ECECEC',
        padding: 5,
        marginBottom: 25,
    }

});