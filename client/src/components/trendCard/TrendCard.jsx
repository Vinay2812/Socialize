import React from 'react'
import "./trendCard.css"
import { TrendData } from '../../dummyData/trendData'

const TrendCard = () => {
  return (
    <div className="trendCard">
        <span>Trends for You</span>
        {TrendData.map((trend, id)=>{
            return(
                <div className="trend" key={id}>
                    <span>#{trend.name}</span>
                    <span>{trend.shares}k shares</span>
                </div>
            )
        })}
    </div>
  )
}

export default TrendCard