import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function Createpost() {
 
  const [data, setData] = useState([]);
  const navigate = useNavigate()


  useEffect(() => {
    // const token = localStorage.getItem("jwt");
    // if (!token) {
    //   navigate("./signup");
    // }

    // Fetching all posts
    fetch("http://localhost:5000/aam", {
      method: "get",
      headers: {
        // Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("fetching all medicines --------------");
        
        console.log(result);
        setData(result);
      })
      .catch((err) => console.log(err));
  }, []);


  return (
   <div>
    <h1>

    Request page

    </h1>
   </div>
  );
}
