
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

const SignupScreen = () => {
    const { signup } = useSupabase();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordRepeat, setPasswordRepeat] = useState<string>("");

    const router = useRouter();
    
    const register = async () => {
        if (password !== passwordRepeat) {
            alert("Passwords do not match");
            return;
        }
        try {
            await signup(email, password);
            router.replace("/login");

            alert("check your mail box to verify your email")
        } catch (e) {
            alert(e);
        }

        


    }


    return (
        <View className="gap-2 p-4">
            <Text>Email: </Text>
            <Input keyboardType="email-address" autoComplete="email" autoCapitalize="none" value={email} onChangeText={(email) => setEmail(email)}/>
            <Text>Password: </Text>
            <Input secureTextEntry={true} value={password} onChangeText={(password) => setPassword(password)}/>
            <Text>Repeat password: </Text>
            <Input secureTextEntry={true} value={passwordRepeat} onChangeText={(password) => setPasswordRepeat(password)}/>

            <Button className="mt-4" onPress={() => register()}><Text>Register</Text></Button>
        </View>
    )
}

export default SignupScreen;