import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Pressable, View } from "react-native";
import { useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "expo-router";

const LoginScreen = () => {
    const [email ,setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    const { login } = useSupabase();
    const router = useRouter();

    const handleLogin = async() => {
        try {
            await login(email, password);
        } catch (e) {
            alert(e);
        }
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
                <CardContent className="gap-6">
                    <View className="gap-6">
                        <View className="gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                id="email"
                                placeholder="m@example.com"
                                keyboardType="email-address"
                                autoComplete="email"
                                autoCapitalize="none"
                                returnKeyType="next"
                                submitBehavior="submit"
                            />
                        </View>
                        <View className="gap-1.5">
                            <View className="flex-row items-center">
                                <Label htmlFor="password">Password</Label>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                                    onPress={() => {
                                        // TODO: Navigate to forgot password screen
                                    }}>
                                    <Text className="font-normal leading-4">Forgot your password?</Text>
                                </Button>
                            </View>
                            <Input
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                id="password"
                                secureTextEntry
                                returnKeyType="send"
                            />
                        </View>
                        <Button className="w-full" onPress={handleLogin} >
                            <Text>Continue</Text>
                        </Button>
                    </View>
                    <View className="flex-row gap-2">
                    <Text className="text-center text-sm">
                        Don&apos;t have an account?{' '}
                        
                    </Text>
                    <Pressable
                            onPress={() => {
                                router.push("/signup");
                            }}>
                            <Text className="text-sm underline underline-offset-4">Sign up</Text>
                        </Pressable>
                        </View>
                </CardContent>
            </Card>
        </View>
    )
}

export default LoginScreen;