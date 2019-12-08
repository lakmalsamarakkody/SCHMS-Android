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
    TouchableOpacity,
    Dimensions,
    ToastAndroid,
    Vibration
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import SwitchSelector from 'react-native-switch-selector'
import Modal from 'react-native-modalbox';

// import QRScanner from '../components/QRScanner'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { SafeAreaView } from 'react-navigation';


var screen = Dimensions.get('window');

export default class Scan extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            qr_id: null,
            qr_type: null,
            switchValue: 'attendance',
            modal_name: null,
            modal_class: null,
            data: {}
        };
    }

    static navigationOptions = {
        header: null
    }

    attendanceModalCancelAction = () => {

        this.refs.modal1.close()

    }

    attendanceModalDoneAction = () => {

        // PAYLOAD
        let payload = new FormData
        payload.append('id', this.state.qr_id)
        payload.append('type', this.state.qr_type)


        // ATTENDANCE API
        fetch("http://192.168.1.7:9090/api/attendance/mark", {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: payload,
        })
        .then(res => res.json())
        .then(Response => {
            if ( Response.status === 'success' ) {
                Vibration.vibrate(100);
                ToastAndroid.showWithGravityAndOffset(
                    'Successfully Makred !',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    50,s
                )
            } else {
                Vibration.vibrate(100);
                ToastAndroid.showWithGravityAndOffset(
                    Response.error.message,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                )
            }
        })
        
        this.refs.modal1.close();

    }

    changeSwitchValue = (value) => {
        this.setState({
            switchValue: value
        })
    }



    openModal = () => {
        this.refs.modal1.open()
    }


    onSuccess = (e) => {

         /**
         * Scanner detects QR code & now we need to identify is
         * this QR is belongs to student or staff member. We can
         * request more details from the API once we figure out
         * the requested entity.
         */

        let QRDetails = e.data.split(":")
        let QRType = QRDetails[0]
        this.setState({
            qr_id: QRDetails[1],
            qr_type: QRType
        })

        // FETCH : DETAILS
        let payload = new FormData
        payload.append('id', QRDetails[1])
        payload.append('type', QRType)

        fetch("http://192.168.1.7:9090/api/details", {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: payload,
        })
        .then(res => res.json())
        .then(Response => {
            if ( QRType === 'student' ) {
                this.setState({
                    modal_name: Response.data.name.full,
                    modal_class: "Class : " + Response.data.class.grade + '-' + Response.data.class.name
                })
            } else {
                this.setState({
                    modal_name: Response.data.name.full,
                    modal_class: "Staff"
                })
            }
        })


        if ( this.state.switchValue == 'attendance'){
            this.openModal()
        } else if ( this.state.switchValue == 'details' ){
            this.navigation.navigate('Details', {
                name: "Shyamin Ayesh"
            });
        }
    }

    onClose = () => {
        this.QRScanner.reactivate()
    }



    render = () => {
        return (
            <>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={ styles.container }>
                        <Text style={ styles.headline }>Scan Attendance</Text>
                    </View>
                    <QRCodeScanner
                        ref={node => { this.QRScanner = node }}
                        onRead={ this.onSuccess }
                        topViewStyle={ styles.topContent }
                        bottomViewStyle={ styles.bottomContent } />
                    {/* <QRScanner openModal={this.openModal} navigation={this.props.navigation} /> */}
                    <View style={{ marginTop: 50, marginHorizontal: 25 }}>
                        <SwitchSelector
                            options={[
                                { label: "Attendance", value: "attendance" },
                                { label: "Details", value: "details" }
                            ]}
                            initial={0}
                            onPress={ (value) => this.changeSwitchValue(value)}
                            textColor={ SwitchSelectorColors.textColor }
                            selectedColor={ SwitchSelectorColors.selectedColor }
                            buttonColor={ SwitchSelectorColors.buttonColor }
                            borderColor={ SwitchSelectorColors.buttonColor }
                            height={50}
                            valuePadding={1}
                            hasPadding={true} />
                    </View>
                    
                </ScrollView>
                
            </SafeAreaView>


            <Modal
                style={ styles.attendanceModal }
                ref={"modal1"}
                swipeToClose={this.state.swipeToClose}
                onClosed={this.onClose}
                onOpened={this.onOpen}
                onClosingState={this.onClosingState}>

                <Text style={styles.heading}>Mark as Present</Text>

                <Image
                    style={ styles.profilePicture }
                    source={{uri: 'https://pbs.twimg.com/profile_images/915314874212868096/pn-v8Ru7_400x400.jpg'}}
                />

                <Text style={ styles.nameText }>{ this.state.modal_name }</Text>
                <Text style={ styles.classText }>{ this.state.modal_class }</Text>

                <View style={ styles.buttonWrapper }>

                    <TouchableOpacity style={ styles.markAttendanceBtnDone } onPress={ () => this.attendanceModalDoneAction() }>
                        <View style={{flexGrow: 1, justifyContent:'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Icon name="ios-checkmark" size={30} color={'#FFF'} />
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}> &nbsp; Done</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={ styles.markAttendanceBtnCancel } onPress={ () => this.attendanceModalCancelAction() }>

                        <View style={{flexGrow: 1, justifyContent:'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Icon name="ios-close" size={30} color={'#e2193e'} />
                            <Text style={{ color: '#e2193e', fontSize: 16, fontWeight: 'bold' }}> &nbsp; Cancel</Text>
                        </View>
                        
                    </TouchableOpacity>

                </View>
            
            </Modal>
            </>
        )
    }
}

const SwitchSelectorColors = {
	textColor: '#727cf5',
	selectedColor: '#FFFFFF',
    buttonColor: '#727cf5',
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#111111',
		alignSelf: 'stretch'
	},
	headline: {
		textAlign: 'center',
		color: '#727cf5',
		paddingVertical: 60,
		fontSize: 26,
        fontWeight: 'bold',
        backgroundColor: '#FFF',
    },
    
    attendanceModal: {
        marginTop: Math.round(Dimensions.get('window').height)/3,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 15,
        alignItems: 'center',
    },

    heading: {
        fontSize: 16,
        color: '#7C7C7C',
        marginBottom: 50,
        opacity: 0.4
    },

    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#C7C7C7',
    },

    nameText: {
        fontSize: 24,
    },

    classText: {
        fontSize: 18,
        color: '#888',
        opacity: 0.9,
        marginTop: 5,
    },

    buttonWrapper: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },

    markAttendanceBtnDone: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        borderRadius: 1000,
        padding: 10,
        width: Math.round(screen.width/2 - 50),
        backgroundColor: '#19e28f',
        marginHorizontal: 10,
        alignItems: 'center',
    },

    markAttendanceBtnCancel: {
        marginTop: 50,
        borderRadius: 1000,
        padding: 10,
        width: Math.round(screen.width/2 - 50),
        borderWidth: 1,
        borderColor: '#e2193e',
        marginHorizontal: 10,
        alignItems: 'center',
    },
    topContent: {
        marginTop: 34,
    },
    bottomContent: {
        marginBottom: 45
    }
});