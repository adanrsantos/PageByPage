import Main from "../components/CreateComp/Main";

const Create = ({ userID }) => {
    return(
        <div className="createWrapper pt-[75px]">
            <Main userID={userID}/>
        </div>
    );
}

export default Create;
