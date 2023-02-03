import React from 'react'
import "../css/Donatepage.css"
import { Link, useNavigate } from "react-router-dom";

import { useState } from 'react'
import { useEffect } from 'react'
import View from "../components/View"
import { toast } from 'react-toastify';
import AdminRequest from './AdminRequest';

 // Toast functions
 const notifyA = (msg) => toast.error(msg)
 const notifyB = (msg) => toast.success(msg)

const getDatafromLS=()=>{
    const data = localStorage.getItem('medicines');
    if(data){
      return JSON.parse(data);
    }
    else{
      return []
    }
  }

export const Donatepage = () => {
    // const user = localStorage.getItem("user")
    // console.log(user.name)

    // const [medicine, setMedicine] = useState({
    //     mname: "",
    //     expiry_date: "",
    //     Quantity: "",
  const navigate = useNavigate()
        


    // })

    // const handleChange = e => {
    //     const { name, value } = e.target
    //     setMedicine({
    //         ...medicine,
    //         [name]: value
    //     })
    // }   

    // useEffect(() => {
    //     localStorage.setMedicine('items', JSON.stringify(medicine));
    //   }, [medicine]);
  

    // const handleclick =(() => {
    //     const items = JSON.parse(localStorage.getItem('medicine'));
    //     if (medicine) {
    //      setMedicine(medicine);
    //     }
    //   }, [medicine]);

    //   const handleclick =()=>{
    //     localStorage.setItem("medicine",medicine)

    //   }

    const [medicines, setmedicines]=useState(getDatafromLS());

  // input field states
  const [med_name, setMedname]=useState('');
  const [expiry_date, setexpiry_date]=useState('');
  const [quantity, setQuantity]=useState('');

  // form submit event
  const handleAddMedicineSubmit=(e)=>{
    e.preventDefault();
    // creating an object
    let medicine={
      med_name,
      expiry_date,
      quantity
    }
    setmedicines([...medicines,medicine]);
    setMedname('');
    setexpiry_date('');
    setQuantity('');
  }

  // delete book from LS
  const deleteMedicine=(quantity)=>{
    const filteredMedicines=medicines.filter((element,index)=>{
      return element.quantity !== quantity
    })
    setmedicines(filteredMedicines);
  }


  const donate_submit = () => {
    const  cart_data = localStorage.getItem('medicines',JSON.stringify(medicines))
    console.log(cart_data)
     
    fetch("http://localhost:5000/add_many_medicine", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: (cart_data)
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error)
        } else {
          notifyB(data.message)
          navigate("/signin")
        }
        console.log(data)
      })
   
  }
  // saving data to local storage
  useEffect(()=>{
    localStorage.setItem('medicines',JSON.stringify(medicines));
  },[medicines])



    return (



        <>
        <div className='mainn'>
        <div className='wrapper'>
      <h1>Medicines App</h1>
      <p>Add and view your medicines using local storage</p>
      <div className='main'>

        <div className='form-container'>
          <form autoComplete="off" className='form-group'
          onSubmit={handleAddMedicineSubmit}>
            <label>Medicine Name</label>
            <input type="text" className='form-control' required
            onChange={(e)=>setMedname(e.target.value)} value={med_name}></input>
            <br></br>
            <label>expiry_date</label>
            <input type="text" className='form-control' required
            onChange={(e)=>setexpiry_date(e.target.value)} value={expiry_date}></input>
            <br></br>
            <label>quantity</label>
            <input type="text" className='form-control' required
            onChange={(e)=>setQuantity(e.target.value)} value={quantity}></input>
            <br></br>
            <button type="submit" id='add' className='btn btn-success btn-md'>
              ADD
            </button>
          </form>
        </div>
        <hr />
        <div className='view-container'>
          {medicines.length>0&&<>
            <div className='table-responsive'>
              <table className='table'>
                <thead className='table'>
                  <tr>
                    <th>Quantity</th>
                    <th>Medicine</th>
                    <th>Expiry Date</th>
                    <th>Delete</th>
                  </tr>
                  
                </thead>
                <tbody>
                  <View medicines={medicines} deleteMedicine={deleteMedicine}/>
                </tbody>
              </table>
            </div>
            <button id='remove' className='btn btn-danger btn-md'
            onClick={()=>setmedicines([])}>Remove All</button>
          </>}
          {medicines.length < 1 && <div id='message'>No medicines are added yet</div>}
        </div>

<<<<<<< HEAD
        <div>
              <button onClick={donate_submit}>Submit</button>
=======
      </div>
    </div>
    <div>
              <button id='submit' onClick={donate_submit}>Submit</button>
>>>>>>> 9dec8377114da85fdc173d78033ebd2bd689928b
            </div>
      </div>
    </div>
    
    </div>
            
            {/* <div className='donate-name'>
                <div className="input-row">
                    <label for="website">Medicine_Name</label>
                    <input type="text" name="mname" id="website" value={medicine.mname}
                        onChange={handleChange}
                    />

                </div>
                <div className="input-row">
                    <label for="exipry">expiry_date_Date</label>
                    <input type="date" name="expiry_date" id="expiry" value={medicine.expiry_date} min="2023-03-03"
                        onChange={handleChange} />
                </div>
                <div className="input-row">
                    <label for="exipry">Quantity</label>
                    <input type="text" name="Quantity" value={medicine.Quantity} id="Quantity"
                        onChange={handleChange} />
                </div>

                <button id='sub_but' onClick={handleclick} >Submit</button>

            </div>
            <div className='Medicine-list'>
                <div>   </div>
            </div> */}

          
        </>
    )
}
