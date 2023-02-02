// import React from 'react';
import React, { useState, useEffect } from "react";
// import Card  from "../components/Card";
import "../css/Request.css";

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBRipple
} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";

const Item = ({ med_name, med_description }) => (
  <MDBCard>
      {/* <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'> */}
        <MDBCardImage className="class" style={{width: 100}} src='https://mdbootstrap.com/img/new/standard/nature/111.webp' fluid alt='...' />
        <a>
          <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
        </a>
      {/* </MDBRipple> */}
      <MDBCardBody>
        <MDBCardTitle>{med_name}</MDBCardTitle>
        <MDBCardText>
          {med_description}
        </MDBCardText>
        <MDBBtn href='#'>Add to Cart</MDBBtn>
      </MDBCardBody>
    </MDBCard>
);

const ItemList = ({ items }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    {items.map((item, index) => (
      <Item key={index} med_name={item.med_name} med_description={item.med_description} />
    ))}
  </div>
);

export default function Createpost() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // const token = localStorage.getItem("jwt");
    // if (!token) {
    //   navigate("./signup");
    // }

    // Fetching all posts
    fetch("http://localhost:5000/all_medicine", {
      method: "get",
      headers: {
        // Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        console.log("result....");

        console.log(result);
      });
  }, []);

  return (
    <div>
      <h1>Request page</h1>
      <div className="class">

      <ItemList  items={data} />
      </div>
    </div>
  );
}













