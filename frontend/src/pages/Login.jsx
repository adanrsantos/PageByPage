import LForm from "../components/LoginComp/LForm";

const Login = ({setUserName, setUserID, setAdmin}) => {
    return(
        <div className="loginWrapper">
            <LForm setUserName={setUserName} setUserID={setUserID} setAdmin={setAdmin}/>
        </div>
    );
}

export default Login;