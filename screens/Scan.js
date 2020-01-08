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
    Vibration,
    Button
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import SwitchSelector from 'react-native-switch-selector'
import Modal from 'react-native-modalbox';
import QRCodeScanner from 'react-native-qrcode-scanner'
import { SafeAreaView } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


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
            attendanceModalData: {
                name: "",
                type: ""
            },
            studentData: {
                name: null,
                class: null,
                dob: null,
                gender: null,
                city: null,
                phone: null
            },
            staffData: {
                name: null,
                nic: null,
                emp_no: null,
                dob: null,
                phone: null,
                city: null                
            }
        };
    }

    static navigationOptions = {
        header: null
    }


    attendanceModalDoneAction = () => {

        // PAYLOAD
        let payload = new FormData
        payload.append('id', this.state.qr_id)
        payload.append('type', this.state.qr_type)


        // ATTENDANCE API
        fetch("https://schms.lakmal.xyz/api/attendance/mark", {
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
        this.refs.attendanceModal.close();
    }


    changeSwitchValue = (value) => {
        this.setState({
            switchValue: value
        })
    }


    openAttendanceModal = () => {
        this.refs.attendanceModal.open()
    }


    openStudentDetailModal = () => {
        this.refs.studentDetailModal.open()
    }


    openStaffDetailModal = () => {
        this.refs.staffDetailModal.open()
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
            qr_type: QRDetails[0]
        })

        // FETCH : DETAILS
        let payload = new FormData
        payload.append('id', QRDetails[1])
        payload.append('type', QRType)

        fetch("https://schms.lakmal.xyz/api/details", {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: payload,
        })
        .then(res => res.json())
        .then(Response => {

            // CLEAR
            this.setState({
                studentData: {},
                staffData: {}
            })

            if ( this.state.switchValue == 'attendance' ){

                this.setState({
                    attendanceModalData: {
                        name: Response.data.name.full,
                        type: QRType.charAt(0).toUpperCase() + QRType.slice(1),
                        propic: "https://schms.lakmal.xyz/data/propic/" + QRType + "/" + Response.data.id
                    }
                })


            } else if ( this.state.switchValue == 'details' ){

                if ( QRType === 'student' ) {
                    this.setState({
                        studentData: {
                            name: Response.data.name.full,
                            class: Response.data.class.grade + '-' + Response.data.class.name,
                            dob: Response.data.dob,
                            gender: Response.data.gender,
                            city: Response.data.address.city,
                            phone: Response.data.phone.mobile,
                            propic: "https://schms.lakmal.xyz/data/propic/" + QRType + "/" + Response.data.id
                        }
                    })
                } else {
                    this.setState({
                        staffData: {
                            name: Response.data.name.full,
                            nic: Response.data.nic,
                            emp_no: Response.data.emp_no,
                            dob: Response.data.dob,
                            phone: Response.data.phone.mobile,
                            city: Response.data.address.city,
                            propic: "https://schms.lakmal.xyz/data/propic/" + QRType + "/" + Response.data.id
                        }
                    })
                }

            }

        })

        if ( this.state.switchValue == 'attendance'){
            this.openAttendanceModal()
        } else if ( this.state.switchValue == 'details' ) {
            if ( QRType === 'student' ){
                this.openStudentDetailModal()
            } else if ( QRType === 'staff' ){
                this.openStaffDetailModal()
            }
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

            {/* ATTENDANCE MODAL */}
            <Modal
                style={ styles.attendanceModal }
                ref={"attendanceModal"}
                swipeToClose={this.state.swipeToClose}
                onClosed={this.onClose}
                onOpened={this.onOpen}
                onClosingState={this.onClosingState}>

                <Text style={styles.heading}>Mark as Present</Text>

                <Image
                    style={ styles.profilePicture }
                    source={{uri: this.state.attendanceModalData.propic}}
                />

                <Text style={ styles.nameText }>{ this.state.attendanceModalData.name }</Text>
                <Text style={ styles.classText }>{ this.state.attendanceModalData.type }</Text>

                <View style={ styles.buttonWrapper }>

                    <TouchableOpacity style={ styles.successButton } onPress={ () => this.attendanceModalDoneAction() }>
                        <View style={{flexGrow: 1, justifyContent:'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Icon name="ios-checkmark" size={30} color={'#FFF'} />
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}> &nbsp; Done</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={ styles.dangerButton } onPress={ () => this.refs.attendanceModal.close() }>

                        <View style={{flexGrow: 1, justifyContent:'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Icon name="ios-close" size={30} color={'#e2193e'} />
                            <Text style={{ color: '#e2193e', fontSize: 16, fontWeight: 'bold' }}> &nbsp; Cancel</Text>
                        </View>
                        
                    </TouchableOpacity>

                </View>
            
            </Modal>



            {/* STUDENT DETAILS MODAL */}
            <Modal
                style={ styles.detailsModal }
                ref={"studentDetailModal"}
                swipeToClose={true}
                onClosed={this.onClose}
                onOpened={this.onOpen}
                onClosingState={this.onClosingState}
            >

                <Text style={ styles.heading }>User Details</Text>

                <Image
                    source={{ uri: this.state.studentData.propic}}
                    style={ styles.profilePicture }
                />

                <Text style={ styles.nameText }>{ this.state.studentData.name }</Text>
                <Text style={ styles.classText }>Student</Text>

                {/* DATA */}
                <View style={ styles.dataWrapper }>

                    {/* EACH DATA */}
                    <View style={ styles.dataRow }>
                        <Text style={ styles.dataName }><FontAwesome name='home' size={15}></FontAwesome> &nbsp;&nbsp; Class</Text>
                        <Text style={ styles.dataValue }>{ this.state.studentData.class }</Text>
                    </View>

                    {/* EACH DATA */}
                    <View style={ styles.dataRow }>
                        <Text style={ styles.dataName }><FontAwesome name='birthday-cake' size={15}></FontAwesome> &nbsp;&nbsp; Birthday</Text>
                        <Text style={ styles.dataValue }>{ this.state.studentData.dob }</Text>
                    </View>

                    {/* EACH DATA */}
                    <View style={ styles.dataRow }>
                        <Text style={ styles.dataName }><FontAwesome name='phone' size={15}></FontAwesome> &nbsp;&nbsp; Phone</Text>
                        <Text style={ styles.dataValue }>{ this.state.studentData.phone }</Text>
                    </View>

                    {/* EACH DATA */}
                    <View style={ styles.dataRow }>
                        <Text style={ styles.dataName }><FontAwesome name='map-marker' size={15}></FontAwesome> &nbsp;&nbsp; City</Text>
                        <Text style={ styles.dataValue }>{ this.state.studentData.city }</Text>
                    </View>

                    <View style={{ padding: 50, alignItems: 'center', }}>
                        <TouchableOpacity style={ styles.successButton } onPress={ () => this.refs.studentDetailModal.close() }>

                            <View style={{flexGrow: 1, justifyContent:'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Icon name="ios-checkmark" size={30} color={'white'} />
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}> &nbsp; OK</Text>
                            </View>
                            
                        </TouchableOpacity>
                    </View>

                </View>
                
            </Modal>
            

            {/* STAFF DETAILS MODAL */}
            <Modal
                style={ styles.detailsModal }
                ref={"staffDetailModal"}
                swipeToClose={true}
                onClosed={this.onClose}
                onOpened={this.onOpen}
                onClosingState={this.onClosingState}
            >

                <Text style={ styles.heading }>User Details</Text>

                <Image
                    source={{ uri: this.state.staffData.propic}}
                    style={ styles.profilePicture }
                />

                <Text style={ styles.nameText }>{ this.state.staffData.name }</Text>
                <Text style={ styles.classText }>Staff</Text>

                {/* DATA */}
                <View style={ styles.dataWrapper }>

                    {/* EACH DATA */}
                    <View style={ styles.dataRow }>
                        <Text style={ styles.dataName }><FontAwesome name='id-card' size={15}></FontAwesome> &nbsp;&nbsp; NIC</Text>
                        <Text style={ styles.dataValue }>{ this.state.staffData.nic }</Text>
                    </View>

                    {/* EACH DATA */}
                    <View style={ styles.dataRow }>
                        <Text style={ styles.dataName }><FontAwesome name='hashtag' size={15}></FontAwesome> &nbsp;&nbsp; Employer No</Text>
                        <Text style={ styles.dataValue }>{ this.state.staffData.emp_no }</Text>
                    </View>

                    {/* EACH DATA */}
                    <View style={ styles.dataRow }>
                        <Text style={ styles.dataName }><FontAwesome name='birthday-cake' size={15}></FontAwesome> &nbsp;&nbsp; Birthday</Text>
                        <Text style={ styles.dataValue }>{ this.state.staffData.dob }</Text>
                    </View>

                    {/* EACH DATA */}
                    <View style={ styles.dataRow }>
                        <Text style={ styles.dataName }><FontAwesome name='phone' size={15}></FontAwesome> &nbsp;&nbsp; Phone</Text>
                        <Text style={ styles.dataValue }>{ this.state.staffData.phone }</Text>
                    </View>

                    {/* EACH DATA */}
                    <View style={ styles.dataRow }>
                        <Text style={ styles.dataName }><FontAwesome name='map-marker' size={15}></FontAwesome> &nbsp;&nbsp; City</Text>
                        <Text style={ styles.dataValue }>{ this.state.staffData.city }</Text>
                    </View>

                    <View style={{ padding: 50, alignItems: 'center', }}>
                        <TouchableOpacity style={ styles.successButton } onPress={ () => this.refs.staffDetailModal.close() }>

                            <View style={{flexGrow: 1, justifyContent:'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Icon name="ios-checkmark" size={30} color={'white'} />
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}> &nbsp; OK</Text>
                            </View>
                            
                        </TouchableOpacity>
                    </View>

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

    successButton: {
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

    dangerButton: {
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
    },


    detailsModal: {
        marginTop: 50,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 15,
        alignItems: 'center',
    },

    dataWrapper: {
        marginTop: 50,
        alignSelf: 'stretch'
    },

    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 35,
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