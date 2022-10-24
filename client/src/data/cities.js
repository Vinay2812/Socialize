import {getAllWOEID} from "twitter-woeid"

let city = [...getAllWOEID("india").map((data)=>data.name)];
export {city}