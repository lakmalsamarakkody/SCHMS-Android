import React, { Component } from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'

export default class QRScanner extends Component {

    constructor(props){
        super(props);
    }

    onSuccess = (e) => {

        /**
         * Scanner detects QR code & now we need to identify is
         * this QR is belongs to student or staff member. We can
         * request more details from the API once we figure out
         * the requested entity.
         */

        let QRDetails = e.data.split(":")


        if ( QRDetails[0] == 'student' ) {

            /**
             * It seems like we detected a QR code that belongs to
             * a student. Now we need to request related student data
             * from the API.
             */

            this.requestStudentDetails(QRDetails[1])

        }

        if ( this.props.switchValue == 'attendance'){
            this.props.openModal();
        } else if ( this.props.switchValue == 'details' ){
            this.props.navigation.navigate('Details');
        }

        // 

    }


    requestStudentDetails = (id) => {
        console.log(id)
    }

    render = () => {
        return (
            <View>
                <QRCodeScanner
                onRead={ this.onSuccess }
                topViewStyle={ styles.topContent }
                bottomViewStyle={ styles.bottomContent }/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topContent: {
        marginTop: 34,
    },
    bottomContent: {
        marginBottom: 45
    }
})