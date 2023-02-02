import React from 'react'
import { Adminpage } from './Adminpage'


export const AdminRequest = (props) => {
  return (
      <>
      <Adminpage/>
      <h1>Requests Pending..</h1>
      <div className='Request-main'>
         {console.log(props)}
      </div>
      </>
  )
}
