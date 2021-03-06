import React from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

import api from "../services/api";
import { connect, disconnect, subscribeToNewDevs } from "../services/socket";

export default function Main({ navigation }) {
  const [currentPosition, setCurrentPosition] = React.useState(null);
  const [devs, setDevs] = React.useState([]);
  const [techs, setTechs] = React.useState("");

  React.useEffect(() => {
    async function loadInititalPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;
        setCurrentPosition({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        });
      }
    }

    loadInititalPosition();
  }, []);

  React.useEffect(() => {
    subscribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    disconnect();
    const { latitude, longitude } = currentPosition;
    connect(latitude, longitude, techs);
  }

  async function loadDevs() {
    const { latitude, longitude } = currentPosition;

    const response = await api.get("/search", {
      params: {
        latitude,
        longitude,
        techs
      }
    });
    setDevs(response.data);
    setupWebsocket();
  }

  function handlePositionChanged(region) {
    setCurrentPosition(region);
  }

  if (!currentPosition) {
    return null;
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handlePositionChanged}
        initialRegion={currentPosition}
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1]
            }}
          >
            <Image
              style={styles.avatar}
              source={{
                uri: dev.avatar_url
              }}
            />
            <Callout
              onPress={() => {
                navigation.navigate("Profile", {
                  github_username: dev.github_username
                });
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <SafeAreaView style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "#fff"
  },

  callout: {
    width: 260
  },

  devName: {
    fontWeight: "bold",
    fontSize: 16
  },

  devBio: {
    color: "#666",
    marginTop: 5
  },

  devTechs: {
    marginTop: 5
  },

  searchForm: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row"
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: "#8e4dff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  }
});
