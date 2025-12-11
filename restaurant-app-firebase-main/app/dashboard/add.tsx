import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/SupabaseContext";
import { useState } from "react";
import { View } from "react-native"

const AddRestaurant = () => {
    const { addRestaurant } = useSupabase();

    const [restaurantName, setRestaurantName] = useState<string>("");
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");


    const save = async () => {
        const latitudeDecimal = parseFloat(latitude.replace(",", "."));
        const longitudeDecimal = parseFloat(longitude.replace(",", "."));


        if (isNaN(latitudeDecimal)) {
            alert("latitude should be a decimal number");
            return;
        }

        if (isNaN(longitudeDecimal)) {
            alert("longitude should be decimal number");
            return;
        }

        try {
        
            await addRestaurant({latitude: latitudeDecimal, longitude: longitudeDecimal, title: restaurantName})
        

            alert("Restaurant added");
        } catch (e) {
            console.log(e);
            alert(e);
        }
    }

    return (
        <View className="p-4 gap-2">
            <Text>Restaurant name: </Text>
            <Input onChangeText={(r) => setRestaurantName(r)} value={restaurantName} inputMode="text"/>

            <Text>Latitude: </Text>
            <Input onChangeText={(l) => setLatitude(l)} value={latitude} inputMode="decimal"/>

            <Text>Longitude: </Text>
            <Input onChangeText={(l) => setLongitude(l)} value={longitude} inputMode="decimal"/>

            <Button className="mt-4" onPress={() => { save() }}><Text>Add new restaurant</Text></Button>
        </View>
    )
}

export default AddRestaurant;