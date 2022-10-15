import { FadeLoader } from "react-spinners"

const Loader = ()=>{
    return (
        <div style={{width: "100%", height: "100vh", position: "relative", backgroundColor: "transparent"}}>
            <FadeLoader color="var(--lightblue)" style={{position: "absolute", right: "50%" , top: "40%",height: "1rem", width: "1rem", zIndex: "1000"}}/> 
        </div>
    )
}

export default Loader