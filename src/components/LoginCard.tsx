import { useState, type FormEvent } from "react";
import { login } from "../api/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginCard = () => {
    const navigate = useNavigate();
    const { setToken } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const submitHandler = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const data = await login(email, password);
            setError(null);
            setToken(data.accessToken);
            navigate("/");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message);
            }
        }
    }

    return (
        <div className="card glass-card">
            <div className="card-body">
                <h3 className="card-title mb-5">Log-in</h3>
                <form onSubmit={submitHandler} className="d-flex flex-column gap-2">
                    <input type="email" placeholder="Email" id="email" onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" id="password" onChange={e => setPassword(e.target.value)} />
                    <p>{error}</p>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <Link to="/register">Register</Link>
                </form>

            </div>
        </div>
    );
}

export default LoginCard;