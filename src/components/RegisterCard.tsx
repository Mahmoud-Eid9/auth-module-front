import { useState, type FormEvent } from "react";
import { register } from "../api/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { regexPatterns } from "../utils/constants";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string, email?: string, password?: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!name) newErrors.name = 'Name is required';
        else if (!regexPatterns.name.test(name)) newErrors.name = 'Name must be at least 3 characters';

        if (!email) newErrors.email = 'Email is required';
        else if (!regexPatterns.email.test(email)) newErrors.email = 'Email is invalid';

        if (!password) newErrors.password = 'Password is required';
        else if (!regexPatterns.password.test(password))
            newErrors.password = 'Password must be at least 8 chars with letters and numbers';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (event: FormEvent) => {
        event.preventDefault();
        if (!validate()) return;
        try {
            await register(email, name, password);
            setServerError(null);
            navigate('/login');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setServerError(err.response?.data?.message || err.message);
            }
        }
    }
    return (
        <div className="card glass-card">
            <div className="card-body">
                <h3 className="card-title mb-5">Register</h3>
                <form onSubmit={submitHandler} className="d-flex flex-column gap-2" >
                    <input type="email" placeholder="Email" id="email" onChange={e => setEmail(e.target.value)} />
                    {errors.name && <p>{errors.email}</p>}
                    <input type="text" placeholder="Name" id="name" onChange={e => setName(e.target.value)} />
                    {errors.name && <p>{errors.name}</p>}
                    <input type="password" placeholder="Password" id="password" onChange={e => setPassword(e.target.value)} />
                    {errors.password && <p>{errors.password}</p>}
                    <h5>{serverError}</h5>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <Link to="/login">Log-in</Link>
                </form>
            </div>
        </div>
    );
}

export default Register;