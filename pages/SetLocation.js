import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    Button,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Moment from "moment"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SetLocation = () => {

    const [currentLongitude, setCurrentLongitude] = useState(''),
        [currentLatitude, setCurrentLatitude] = useState(''),
        [locationStatus, setLocationStatus] = useState(''),
        [locationAddress, setLocationAddress] = useState(''),
        navigation = useNavigation();

    useEffect(() => {
        AsyncStorage.setItem('LOCATION_DETAILS', '');
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                getOneTimeLocation();
                subscribeLocationLocation();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getOneTimeLocation();
                        subscribeLocationLocation();
                    } else {
                        setLocationStatus('Permission Denied');
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        };
        requestLocationPermission();
        return () => {
            Geolocation.clearWatch(watchID);
        };
    }, []);

    const getOneTimeLocation = () => {
        setLocationStatus('Getting Location ...');
        Geolocation.getCurrentPosition(
            (position) => {
                setLocationStatus('You are Here');
                const currentLongitude = JSON.stringify(position.coords.longitude);
                const currentLatitude = JSON.stringify(position.coords.latitude);

                setCurrentLongitude(currentLongitude);
                setCurrentLatitude(currentLatitude);
                getAddress(position)
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };

    const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
            (position) => {

                setLocationStatus('You are Here');
                const currentLongitude = JSON.stringify(position.coords.longitude);
                const currentLatitude = JSON.stringify(position.coords.latitude);

                setCurrentLongitude(currentLongitude);
                setCurrentLatitude(currentLatitude);
                // getAddress(position)
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 1000
            },
        );
    };

    const getAddress = (locations) => {
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + locations.coords.latitude + "," + locations.coords.longitude + "&key=" + 'AIzaSyBZboN5aSklTn-W-7dbLUtOhKpsGKwGcKI')
            .then((response) => response.json()).then((responseJson) => {
                setLocationAddress(responseJson.results[0].formatted_address)
                AsyncStorage.getItem('LOCATION_DETAILS').then(value => {
                    if (value !== null) {
                        var details = JSON.parse(value).concat({
                            id: Date.now(),
                            longitude: locations.coords.latitude,
                            latitude: locations.coords.longitude,
                            address: responseJson.results[0].formatted_address,
                            time: Moment(locations.timestamp).format("hh:MM A")
                        })
                        AsyncStorage.setItem('LOCATION_DETAILS', JSON.stringify(details));
                    } else {
                        var details = [{
                            id: Date.now(),
                            longitude: locations.coords.latitude,
                            latitude: locations.coords.longitude,
                            address: responseJson.results[0].formatted_address,
                            time: Moment(locations.timestamp).format("hh:MM A")
                        }]
                        AsyncStorage.setItem('LOCATION_DETAILS', JSON.stringify(details));
                    }
                });
            });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.container}>
                    <Image
                        source={{
                            uri:
                                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/location.png',
                        }}
                        style={{ width: 100, height: 100 }}
                    />
                    <Text style={styles.boldText}>
                        {locationStatus}
                    </Text>
                    <Text
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 16,
                        }}>
                        Longitude: {currentLongitude}
                    </Text>
                    <Text
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 16,
                        }}>
                        Latitude: {currentLatitude}
                    </Text>
                    <Text
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 16,
                        }}>
                        Address: {locationAddress}
                    </Text>
                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Set Location"
                            onPress={() => getOneTimeLocation()}
                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Previous Location"
                            onPress={() => navigation.navigate('Location List')}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boldText: {
        fontSize: 25,
        color: 'red',
        marginVertical: 16,
    },
});

export default SetLocation;