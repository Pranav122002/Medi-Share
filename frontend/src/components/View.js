import React from 'react'
import "../css/Donatepage.css"

export default function View ({medicines,deleteMedicine}) {
    
    return medicines.map(medicine=>(
        
        <tr key={medicine.quantity}>
            <td>{medicine.quantity}</td>
            <td>{medicine.med_name}</td>
            <td>{medicine.expiry_date}</td>
            <td className='delete-btn' >
<<<<<<< HEAD
                <button onClick={()=>deleteMedicine(medicine.quantity)}><span class="material-symbols-outlined">
delete
</span></button>
=======
                <button id='delete' onClick={()=>deleteMedicine(medicine.quantity)}>Delete</button>
>>>>>>> 9dec8377114da85fdc173d78033ebd2bd689928b
            </td>           
        </tr>            
    
))
}