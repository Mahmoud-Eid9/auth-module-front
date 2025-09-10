import { useEffect, useState, type FormEvent } from "react";
import { callHome, logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchHome = async () => {
            try {
                const result = await callHome();
                setMessage(result.data);
            } catch (err) {
                console.error("Failed to fetch home:", err);
            }
        };

        fetchHome();
    }, [])

    const handleLogout = async (event: FormEvent) => {
        event.preventDefault();
        await logout();
        navigate("/login");
    }

    return (
        <div className="card glass-card d-flex gap-5 justify-content-center">
            <h1>{message}</h1>
            <button onClick={handleLogout} className="btn btn-primary w-50 m-auto">Logout</button>
        </div>
        );
}

export default Home;