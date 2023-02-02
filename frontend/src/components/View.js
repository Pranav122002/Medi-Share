import React from 'react'


export default function View ({medicines,deleteMedicine}) {
    
    return medicines.map(medicine=>(
        
        <tr key={medicine.quantity}>
            <td>{medicine.quantity}</td>
            <td>{medicine.med_name}</td>
            <td>{medicine.expiry_date}</td>
            <td className='delete-btn' >
                <button onClick={()=>deleteMedicine(medicine.quantity)}>Click</button>
            </td>           
        </tr>            
    
))
}