import React, { useEffect, useState, useContext } from "react";
import "../css/Inventory.css";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Modal from 'react-modal';
import Hnavbar from "./Hnavbar";
import '../css/Modal.css'
import { API_BASE_URL } from "../config";
import "../css/Modal.css"
import geocode from "./geocodeFun";
import * as Yup from 'yup';

export default function Inventory() {

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);


  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [cart, setCart] = useState([])
  const [selectMedicine, setSelectMedicine] = useState(null)
  const [medCount, setMedCount] = useState(1)
  const [cartModal, setCartModal] = useState(false)
  const [userID, setUserID] = useState("")
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState(null)

  // Future update: 
  //
  const addToCart = (item) => {
    console.log(item)
    fetch(`${API_BASE_URL}/user-cart/${userID}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{
          med_id: item._id,
          medicine_name: item.medicine_name,
          quantity: 1
        }])
      }).then(res => res.json)
      .then((doc) => {
        console.log("doc: ", doc)
        setCart((already_in_the_cart) => [
          ...already_in_the_cart, {
            medicine_name: item.medicine_name,
            quantity: 1,
            med_id: item._id,
          }
        ])
      })
      .catch(err => console.log(err))



  }
  const OpenCartModal = () => {
    setCartModal(true)
  }
  const CloseCartModal = () => {
    setCartModal(false)
  }

  const handleLocation = () => {
    setLocation()
  }

  const fetchMedicines = (query) => {
    setSearch(query);
    fetch(`${API_BASE_URL}/search-medicines`, {
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

  const getMedicine = () => {
    fetch(`${API_BASE_URL}/allmedicines`)
      .then(res => res.json())
      .then(doc => {
        setSearchResult(doc)
        console.log(searchResult)
      })
      .catch(err => console.log(err))
  }

  const fetchUser = () => {
    fetch(
      `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    ).then((res) => res.json())
      .then((result) => {

        console.log(result.cart)
        setUserID(result._id)
        setCart(result.cart)
      })
  }

  const removeMed = (med) => {
    setCart((preCart) =>
      preCart.filter((item) => item.medicine_name !== med.medicine_name)
    );
    fetch(`${API_BASE_URL}/delete-cart-item/${userID}`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medId: med._id
        })
      })
      .then(res => res.json)
      .then(result => console.log(result))
  };


  const checkout = () => {
    console.log("cart: " + JSON.stringify(cart));
    console.log("location: ", location);
    Promise.all(
      cart.map((med) => {
        return quantityValidation
          .validate({ quantity: med.quantity }, { abortEarly: false })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            notifyA(`${med.medicine_name} ${err.message}`);
            throw err;
          });
      })
    )
      .then(() => {
        return geocode(location);
      })
      .then((coordinates_) => {
        setCoordinates(coordinates_);
        console.log(coordinates);
        return locationValidation.validate({ location }, { abortEarly: false });
      })
      .then((location_val) => {
        return fetch(`${API_BASE_URL}/medicine-availablity`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart,
            userID,
            location,
            coordinates,
            location_val,
          }),
        });
      })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          notifyB(result.success);
          setCart([]);
        } else if (result.error) {
          notifyA(result.error);
        } else {
          notifyA(`${result.join(" ")} not available in sufficient quantity`);
        }
      })
      .catch((error) => {
        console.log(error)
        notifyA(error.message);
      });

  }
  //cart quantity validation
  const quantityValidation = Yup.object().shape({
    quantity: Yup.number()
      .min(1, "Quantity can not be less than one")
  })

  const locationValidation = Yup.object().shape({
    location: Yup.string()
      .required("Location is required")
  })
  // const fetchMedicines
  useEffect(() => {
    fetchUser();
    getMedicine()
  }, []);

  useEffect(() => {
    console.log(cart)
  }, [cart]);

  const locationInput = document.getElementById("dasdaf");
  const searchBox = new window.google.maps.places.SearchBox(locationInput);


  useEffect(() => {
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places && places.length > 0) {
        // Set the location place to the first result
        console.log(places[0])
        const selected = places[0].formatted_address;
        setLocation(selected);
      }
    });
  }, []);

  return (
    <div className="inventorymain">
      <h1>Inventory</h1>
      <div className="bodyy">

        <div className="searchcolumn">
          <div className="searchbox">
            <div className="topsearch">
              <input
                className="searchinput"
                type="text"
                placeholder="Search medicines"
                value={search}
                onChange={(e) => fetchMedicines(e.target.value)}
              />
              <button className="cart-button" onClick={OpenCartModal}>Cart</button>
            </div>
            <Modal className="Modal__container" isOpen={cartModal} onRequestClose={CloseCartModal}>
              {console.log(cart)}
              {
                cart.map((med) =>
                (
                  <ul key={med.med_id}>
                    <li className="item_container">
                      <div>
                        <input
                          type="number"
                          value={med.quantity}
                          onChange={(e) => {
                            const newQuantity = Number(e.target.value);
                            setCart((prevCart) =>
                              prevCart.map((item) =>
                                item.medicine_name === med.medicine_name ? { ...item, quantity: newQuantity } : item
                              )
                            );
                          }}
                        />
                        {"x      "}
                        {"  " + med.medicine_name}
                      </div>
                      <button onClick={() => removeMed(med)}>Remove</button>
                    </li>

                  </ul>
                ))
              }

              {
                cart.length ? (
                  <>
                    <input
                      type="text"
                      placeholder="Delivery Location"
                      onChange={(e) => setLocation(e.target.value)}
                      id="dasdaf"
                    />
                    <br />
                    <button id="gasgfa" onClick={checkout}>Checkout</button>
                  </>
                ) : (
                  <p >Nothing in cart</p>
                )
              }

              <button onClick={CloseCartModal}>Close</button>
            </Modal>
            <div className="box-container">

              {searchResult.map((item) => {
                return (
                  <div className="box" key={item._id}>
                    <h3 style={{ color: "black" }}> {item.medicine_name}</h3>
                    <p className="p1">{item.description}</p>
                    <p className="p2" style={{ color: "black" }}>{item.disease}</p>
                    <p className="p1">
                      {item.count <= 0 ? <p>Out of Stock</p> :

                        <>{item.count <= 10 ? <> 
                          <p>only {item.count} left</p>
                          {
                            cart.some((cartItem) => cartItem.medicine_name === item.medicine_name) ? (
                              <button disabled>already in Cart</button>
                            ) :
                              (<button onClick={() => addToCart(item)}>Add to Cart</button>)
                          }
                       
                        </> :
                         
                            <> 
                            <p>In Stock</p>
                            {
                              cart.some((cartItem) => cartItem.medicine_name === item.medicine_name) ? (
                                <button disabled>already in Cart</button>
                              ) :
                                (<button onClick={() => addToCart(item)}>Add to Cart</button>)
                            }
                         
                          </>}
                        </>
                      }
                    </p>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
