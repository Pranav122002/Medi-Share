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
    fetch("http://localhost:5000/all_medicine", {
      method: "get",
      headers: {
        // Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("fetching all medicines --------------");
        
        console.log(result);
        setData(result[1]._id);
        console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);


  return (
   <div>
    <h1>

    Request page

    <div>
   {data}
   </div>
    </h1>
   </div>
  );
}
