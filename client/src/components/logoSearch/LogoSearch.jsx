import React from 'react'
import "./logoSearch.css"
import Logo from "./Logo/s-logo.png"
import { Search } from '@material-ui/icons'


const LogoSearch = () => {
  return (
    <div className="logoSearch">
        <img src={Logo} alt="" className='logo'/>
        <div className="search">
            <input type="text" placeholder="#Explore" className='search'/>
            <div className="searchIcon">
                <Search className='icon'/>
            </div>
        </div>
    </div>
  )
}

export default LogoSearch