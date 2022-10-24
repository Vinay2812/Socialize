import React, { useEffect, useRef } from 'react'
import "./trendCard.css"
// import { TrendData } from '../../dummyData/trendData'
import {MyLocation} from "@material-ui/icons"
import { useState } from 'react'

import {API} from "../../api/AxiosInstance"
import {getSingleWOEID} from "twitter-woeid"

import { city } from '../../data/cities'

const TrendCard = () => {
  const [trendData, setTrendData] = useState(null);
  const [woeid, setWoeid] = useState("23424848");

  useEffect(()=>{
    const getTrends = async()=>{
      try {
        const res = await API.get(`/trends?woeid=${woeid}`);
        setTrendData(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    getTrends();
    
  }, [woeid]);

  const [location, setLocation] = useState("India");
  const [editable, setEditable] = useState(false);
  const [searchLocation, setSearchLocation] = useState([location]);
  const locationRef = useRef();

  const handleLocation = ()=>{
    const val = locationRef.current.value;
    setLocation(val);
    setSearchLocation(city.filter((c)=>c.toLowerCase().startsWith(val.toLowerCase())));
  }

  return (
    <>
      <div className="trendCard">
          <span>Trends for You</span>
          <div className="trend-menu">
            <div className="location-input">
              <input type="text"  onChange={()=>handleLocation()} ref={locationRef} value={location} readOnly={!editable}/>
              <MyLocation onClick = {()=>setEditable(prev=>!prev)}/>
            </div>
            <div className="place" style={!editable? {display: "none"} : {}}>
              {
                searchLocation?.length ? 
                  searchLocation.map((loc)=>{
                    return (
                      <div onClick={()=>{
                        setLocation(loc);
                        setEditable(false);
                        setWoeid(getSingleWOEID(loc.toLowerCase())[0].woeid);
                   
                      }}>{loc}</div>
                    )
                  })
                : <div>No location found</div>
              }
            </div>
          </div>

          <div className="trend-container">
            {trendData?.map((trend, id)=>{
                return(
                    <div className="trend" key={id}>
                      <a href={trend.url} target="_blank" rel="noopener noreferrer">
                        <span>{trend.name}</span>
                      </a>
                      <span>{trend.shares} shares</span>
                    </div>
                )
            })}
          </div>
      </div>
    </>
  )
}

export default TrendCard