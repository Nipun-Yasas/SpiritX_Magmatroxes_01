"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [toke, setToken] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const token = localStorage.getItem("token");
        setToken(token);

        if (!token) {
            router.push("/signUp");
        } else {
            setUsername(storedUsername); 
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        router.push("/signUp");
    };

    if (!isAuthenticated) {
        return (<>
        {toke ? <h1 className="text-red-500 text-2xl">Access denied</h1> : <></>}
        </>)
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Dashboard</h1>
            {username ? <h2>Hello, {username}!</h2> : <h2>Loading...</h2>}

            <button onClick={handleLogout} style={{
                marginTop: "20px",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "5px"
            }}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
