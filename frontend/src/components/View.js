import React from 'react'


export default function View ({medicines,deleteMedicine}) {
    
    return medicines.map(medicine=>(
        
        <tr key={medicine.quantity}>
            <td>{medicine.quantity}</td>
            <td>{medicine.medname}</td>
            <td>{medicine.expire}</td>
            <td className='delete-btn' >
                <button onClick={()=>deleteMedicine(medicine.quantity)}>Click</button>
            </td>           
        </tr>            
    
))
}