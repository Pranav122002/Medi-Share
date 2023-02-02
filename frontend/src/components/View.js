import React from 'react'
import "../css/Donatepage.css"

export default function View ({medicines,deleteMedicine}) {
    
    return medicines.map(medicine=>(
        
        <tr key={medicine.quantity}>
            <td>{medicine.quantity}</td>
            <td>{medicine.med_name}</td>
            <td>{medicine.expiry_date}</td>
            <td className='delete-btn' >
                <button id='delete' onClick={()=>deleteMedicine(medicine.quantity)}>Delete</button>
            </td>           
        </tr>            
    
))
}