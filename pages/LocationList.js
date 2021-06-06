import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, FlatList, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationList = () => {

    const [locationList, setLocationList] = useState([])

    useEffect(() => {
        AsyncStorage.getItem('LOCATION_DETAILS').then(value =>
            setLocationList(JSON.parse(value))
        );
    }, [])

    const renderItem = ({ item }) => (
        <View style={styles.item} key={item.id}>
            <Text>Longitude: {item.longitude}</Text>
            <Text>Latitude: {item.latitude}</Text>
            <Text>Address: {item.address}</Text>
            <Text>Time: {item.time}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={locationList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#FFF',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
})

export default LocationList
