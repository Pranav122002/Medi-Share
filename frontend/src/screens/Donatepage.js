import React from 'react'
import "../css/Donatepage.css"
import { useState } from 'react'
import { useEffect } from 'react'
import View from "../components/View"

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
    //     Expire: "",
    //     Quantity: "",
        


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
  const [medname, setMedname]=useState('');
  const [expire, setExpire]=useState('');
  const [quantity, setQuantity]=useState('');

  // form submit event
  const handleAddMedicineSubmit=(e)=>{
    e.preventDefault();
    // creating an object
    let medicine={
      medname,
      expire,
      quantity
    }
    setmedicines([...medicines,medicine]);
    setMedname('');
    setExpire('');
    setQuantity('');
  }

  // delete book from LS
  const deleteMedicine=(quantity)=>{
    const filteredMedicines=medicines.filter((element,index)=>{
      return element.quantity !== quantity
    })
    setmedicines(filteredMedicines);
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
            onChange={(e)=>setMedname(e.target.value)} value={medname}></input>
            <br></br>
            <label>Expire</label>
            <input type="text" className='form-control' required
            onChange={(e)=>setExpire(e.target.value)} value={expire}></input>
            <br></br>
            <label>quantity</label>
            <input type="text" className='form-control' required
            onChange={(e)=>setQuantity(e.target.value)} value={quantity}></input>
            <br></br>
            <button type="submit" className='btn btn-success btn-md'>
              ADD
            </button>
          </form>
        </div>

        <div className='view-container'>
          {medicines.length>0&&<>
            <div className='table-responsive'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>medname</th>
                    <th>Expire</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <View medicines={medicines} deleteMedicine={deleteMedicine}/>
                </tbody>
              </table>
            </div>
            <button className='btn btn-danger btn-md'
            onClick={()=>setmedicines([])}>Remove All</button>
          </>}
          {medicines.length < 1 && <div>No medicines are added yet</div>}
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
                    <label for="exipry">Expire_Date</label>
                    <input type="date" name="Expire" id="expiry" value={medicine.Expire} min="2023-03-03"
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
