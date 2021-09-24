import React, { useEffect, useState } from 'react';
import data from './data.js'

import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import MapView, { Marker } from 'react-native-maps';

const firestoreApp = firestore();
const GeoFirestore = geofirestore.initializeApp(firestoreApp);
const geocollection = GeoFirestore.collection('isbike');

const App = () => {
  const [CoordList, setCoordList] = useState([])
  useEffect(() => {
    //initGeocollection();
    getLocation()
  }, [])


  // Kurtköy
  const searchItem = {
    lat: 40.924643,
    lon: 29.290590
  }

  const getLocation = () => {
    const query = geocollection.near({ center: new firestore.GeoPoint(searchItem.lat, searchItem.lon), radius: 2 });
    query.get().then((value) => {
      const coordinates = value.docs;
      setCoordList(coordinates)
    });
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: searchItem.lat,
        longitude: searchItem.lon,
        latitudeDelta: 0.0300,
        longitudeDelta: 0.0300,
      }}
    >
    {CoordList.length > 0 ? CoordList.map((marker, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: marker.data().coordinates._latitude,
          longitude: marker.data().coordinates._longitude
        }}
        title={marker.data().description}
        description={'Available: ' +marker.data().available +' Unavailable: ' + marker.data().unavailable}
      />
    )) : null }
    </MapView>
  );
};

export default App;
