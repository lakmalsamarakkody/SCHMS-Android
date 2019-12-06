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
    Image,
    Button,
    TouchableOpacity
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Details extends Component {
    
    static navigationOptions = {
        title: 'Details',
        headerTitleStyle: {
            fontSize: 15
        }
    }
     
    constructor(props){
        super(props)
    }

    render = () => {
        return(

            <SafeAreaView>
                <ScrollView>

                    {/* CARD */}
                    <View style={ styles.cardWrapper }>

                        <Image
                            style={ styles.profilePicture }
                            source={{uri: 'https://pbs.twimg.com/profile_images/915314874212868096/pn-v8Ru7_400x400.jpg'}}
                        />

                        <View style={ styles.cardText }>
                            <Text style={ styles.nameText }>Srivin Prabhash Fernando</Text>
                            <Text style={ styles.indexText }>#28437</Text>
                        </View>

                    </View>

                    {/* DATA */}
                    <View style={ styles.dataWrapper }>

                        {/* EACH DATA */}
                        <View style={ styles.dataRow }>
                            <Text style={ styles.dataName }><Icon name='home' size={15}></Icon> &nbsp;&nbsp; Class</Text>
                            <Text style={ styles.dataValue }>11 - A</Text>
                        </View>

                        {/* EACH DATA */}
                        <View style={ styles.dataRow }>
                            <Text style={ styles.dataName }><Icon name='birthday-cake' size={15}></Icon> &nbsp;&nbsp; Birthday</Text>
                            <Text style={ styles.dataValue }>18, March 1998</Text>
                        </View>

                        {/* EACH DATA */}
                        <View style={ styles.dataRow }>
                            <Text style={ styles.dataName }><Icon name='calendar' size={15}></Icon> &nbsp;&nbsp; Age</Text>
                            <Text style={ styles.dataValue }>21 Years</Text>
                        </View>

                        {/* EACH DATA */}
                        <View style={ styles.dataRow }>
                            <Text style={ styles.dataName }><Icon name='users' size={15}></Icon> &nbsp;&nbsp; Gender</Text>
                            <Text style={ styles.dataValue }>Male</Text>
                        </View>

                    </View>

                </ScrollView>
            </SafeAreaView>

        )
    }

}

const styles = StyleSheet.create({

    cardWrapper: {
        flexDirection: 'row',
        padding: 25,
        justifyContent: 'flex-start'
    },

    profilePicture: {
        height: 75,
        width: 75,
        marginRight: 15,
        borderRadius: 1000
    },

    nameText: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },

    indexText: {
        color: '#7C7C7C',
    },

    dataWrapper: {
        marginTop: 25,
    },

    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 25,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ECECEC',
    },
    
    dataName: {
        fontSize: 14,
        color: '#a0a0a0',
    },

    dataValue: {
        fontSize: 17,
    }

});