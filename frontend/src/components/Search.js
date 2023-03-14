import React, { useEffect, useState, useContext } from "react";
import "../css/Search.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";

export default function Search() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const fetchMedicines = (query) => {
    setSearch(query);
    fetch("http://localhost:5000/search-medicines", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        console.log("results ......", results);

        setSearchResult(results.medicine);
      });
  };

  return (
    <div>
      <Hnavbar />
      <Navbar />

      <div className="searchcolumn">
        <div className="searchbox">
          <input
            className="searchinput"
            type="text"
            placeholder="Search medicines"
            value={search}
            onChange={(e) => fetchMedicines(e.target.value)}
          />

          <ul>
            {searchResult.map((item) => {
              return (
                <li className="link">
                  Medicine name : {item.medicine_name}
                  <p className="disease">Disease : {item.disease}</p>
                  <p>Description : {item.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
