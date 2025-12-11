import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/SupabaseContext";
import MapView, { Marker } from "react-native-maps";

const MapScreen = () => {
    const { logout, loading, restaurants } = useSupabase();
    
    if (loading) {
        return (
            <ActivityIndicator animating={true}/>
        )
    }

    console.log(restaurants);

    return (
        <View className="flex-1">
            <Button onPress={() => logout()}><Text>Logout</Text></Button>

            <MapView style={{flex: 1}}>
                {
                    restaurants.map((restaurant) => (
                        <Marker key={restaurant.id} coordinate={{
                            latitude: restaurant.latitude,
                            longitude: restaurant.longitude
                        }} title={restaurant.title}/>
                    ))
                }
              
            </MapView>
        </View>
    )
}

export default MapScreen;