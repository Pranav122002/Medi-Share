import React from 'react'
import { NavLink } from 'react-router-dom'
import "../css/Adminpage.css"

export const Adminpage = () => {
  return (
    <>
        <div className='AdminNav'>
            <NavLink to={"/AdminRequest"}><button>Requests</button></NavLink>
            <NavLink to={"/AdminDonorList"}><button>Donors</button></NavLink>
            <NavLink to={"/"}><button>Volunteers</button></NavLink>
            <NavLink to={"/"}><button>Inventory</button></NavLink>
        </div>
        <hr />

    </>
  )
}
