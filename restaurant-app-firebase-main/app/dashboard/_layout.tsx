import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

const DashboardLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{title: "Map", tabBarIcon: ({size, color}) => <FontAwesome name="map-marker" size={size} color={color} />}}/>
            <Tabs.Screen name="add" options={{title: "Add Restaurant", tabBarIcon: ({size, color}) => <Ionicons name="restaurant" size={size} color={color} />}}/>
        </Tabs>
    )
}

export default DashboardLayout;