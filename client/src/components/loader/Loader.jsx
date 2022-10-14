import { FadeLoader } from "react-spinners"

const Loader = ()=>{
    return (
        <div style={{width: "100vh", height: "100vh", position: "relative", backgroundColor: "transparent"}}>
            <FadeLoader color="var(--lightblue)" style={{position: "absolute", right: "50vh" , top: "50vh",aspectRatio: "1", width: "1rem", zIndex: "1000"}}/> 
        </div>
    )
}

export default Loader