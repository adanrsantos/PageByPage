import LFormCSS from "./LForm.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";

const LForm = ({setUserName, setUserID, setAdmin}) => {
    
    const [userInput, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { userInput, password };
            const response = await fetch("http://localhost:5001/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (response.ok){
                const user = await response.json();
                alert("Login Success!");
                setUserName(user.username);
                setUserID(user.user_id);
                console.log(user.username + " " + user.user_id);

                // Set session expiration (e.g., 1 hour)
                const currentTime = new Date().getTime();
                const expirationTime = currentTime + 3600000; // 1 hour expiration

                localStorage.setItem("user", JSON.stringify({
                    userName: user.username,
                    userID: user.user_id,
                    admin: user.admin,
                    expirationTime: expirationTime
                }));

                if (user.admin){
                    setAdmin(true);
                }
            } else {
                const errorData = await response.json();
                console.error(`Error: ${errorData.error}`);
                alert(errorData.error);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return(
        <div className={LFormCSS.wrapper}>
            <form onSubmit={handleSubmit}>
                <h1 className={LFormCSS.h1}>Login</h1>
                <div className={LFormCSS.inputCont}>
                    <input className={LFormCSS.input} type="text" placeholder="Username or Email" required value={userInput} onChange={(e) => setUsername(e.target.value)}/>
                    <FaUser className={LFormCSS.icon}/>
                </div> 
                <div className={LFormCSS.inputCont}>
                    <input className={LFormCSS.input} type={showPassword ? "text" : "password"} placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <FaLock className={LFormCSS.icon}/>
                </div>
                <div className={LFormCSS.inputContShow}>
                    <div className={LFormCSS.testing}>
                        <label className={LFormCSS.showPass} htmlFor="check">Show password?</label>
                        <input className={LFormCSS.checkbox} type="checkbox" id="check" checked={showPassword} onChange={() => setShowPassword((prevState) => !prevState)}/>
                    </div>
                </div>
                <div className={LFormCSS.inputCont}>
                    <button className={LFormCSS.btn} type="submit">Login</button>
                </div>
                <div className={LFormCSS.registerCont}>
                    <p className={LFormCSS.question}>Don't have an account? 
                        <Link className={LFormCSS.link} to="/register"> Register</Link></p>
                </div>
            </form>
        </div>
    );
}

export default LForm;