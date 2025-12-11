import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface SupabaseContextProps {
    session: Session | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loggingIn: boolean;
    initializing: boolean;
    loading: boolean;
    error: Error | null;
    restaurants: Restaurant[],
    addRestaurant: (res: Omit<Omit<Restaurant, "id">, "created_at">) => Promise<void>,
    signup: (email: string, password: string) => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

const SupabaseProvider = ({children} : { children: ReactNode}) => {
    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const [initializing, setInitializing] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    const [trigger, setTrigger] = useState<number>(0);
    
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        const init = async() => {
            try {
                const { data } = await supabase.auth.getSession();
                if (cancelled) return;
                setSession(data.session);

            } catch (e) {
                console.log("Error fetching session", e);
            } finally {
                if (cancelled) return;
                setInitializing(false);
            }
        }
        init();

        const { data : { subscription }} = supabase.auth.onAuthStateChange((event, newSession) => {
            if (cancelled) return;
            setSession(newSession);
            if (event === "SIGNED_IN") {
                router.replace("/dashboard")
            } else if (event === "SIGNED_OUT") {
                router.replace("/login");
            }
        });


        return () => {
            cancelled = true;
            subscription.unsubscribe();
        }
    }, [])

    const login = async(email: string, password: string) => {
        setLoggingIn(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({email, password});
            if (error) throw error;
        } finally {
            setLoggingIn(false);
        }
    }

    const logout = async() => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (err) {
            console.log(err);
        }
    }

    const signup = async(email: string, password: string) => {
        try {
            const {error} = await supabase.auth.signUp({email, password});

            if (error) throw error;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    const addRestaurant = async(restaurant: Omit<Omit<Restaurant, "id">, "created_at">) => {
        try {
            const { error } = await supabase.from("restaurants").insert(restaurant);
            if (error) throw error;
            setTrigger(trigger => trigger + 1)
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    useEffect(() => {
        let cancelled = false;

        const fetchRestaurants = async() => {

            try {
                setLoading(true);
                const {data, error } = await supabase.from("restaurants").select("*");
                if (error) {
                    console.error("Error fetching restaurants");
                    throw error;
                }

                console.log(data);

                if (cancelled) return;
                setRestaurants(data);

            } catch (e) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }

        }

        fetchRestaurants();
        
        return () => {
            cancelled = true;
        }
    }, [trigger])



    return (
        <SupabaseContext.Provider value={{loggingIn, initializing, session, login, logout, loading, restaurants, error, addRestaurant, signup}}>
            {children}
        </SupabaseContext.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext);

    if (context === undefined) {
        throw new Error("useSupabase must be used within an SupabaseProvider");
    }

    return context;
}

export default SupabaseProvider