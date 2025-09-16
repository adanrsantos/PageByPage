import RFormCSS from "./RForm.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

const RForm = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { 
                username: formData.username,  // Ensure you are sending these fields correctly
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName
            };

            const response = await fetch("http://localhost:5001/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (response.ok){
                const data = await response.json();
                console.log(data.username);
                alert("Registration Success!");
                navigate("/login");
            } else{
                const errorData = await response.json();
                console.error(`Error: ${errorData.error}`);
                alert(errorData.error);
            }
        } catch (error) {
            console.error(error.message);
            alert("An error occurred. Please try again later.");
        }
    }

    return(
        <div className={RFormCSS.wrapper}>
            <form onSubmit={handleSubmit}>
                <h1 className={RFormCSS.h1}>Register</h1>
                <div className={RFormCSS.inputCont1}>
                    <div className={RFormCSS.inputName}>
                        <input type="text" className={RFormCSS.inputVal} placeholder="First Name" required value={formData.firstName} onChange={handleChange("firstName")}/>
                        <input type="text" className={RFormCSS.inputVal} placeholder="Last Name" required value={formData.lastName} onChange={handleChange("lastName")}/>
                    </div>
                </div>
                <div className={RFormCSS.inputCont}>
                    <input className={RFormCSS.input} type="text" placeholder="Username" required value={formData.username} onChange={handleChange("username")}/>
                    <FaUser className={RFormCSS.icon}/>
                </div> 
                <div className={RFormCSS.inputCont}>
                    <input type="text" className={RFormCSS.input} placeholder="Email" required value={formData.email} onChange={handleChange("email")}/>
                    <MdAlternateEmail className={RFormCSS.email}/>
                </div>
                <div className={RFormCSS.inputCont}>
                    <input className={RFormCSS.input} type="password" placeholder="Password" required value={formData.password} onChange={handleChange("password")}/>
                    <FaLock className={RFormCSS.icon}/>
                </div>
                <div className={RFormCSS.inputCont}>
                    <button className={RFormCSS.btn} type="submit">Create Account</button>
                </div>
                <div className={RFormCSS.registerCont}>
                    <p className={RFormCSS.question}>Go back to Login? 
                        <Link className={RFormCSS.link} to="/login"> Login</Link></p>
                </div>
            </form>
        </div>
    );
}

export default RForm