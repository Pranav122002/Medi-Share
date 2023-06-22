require('dotenv').config();
const moment = require('moment-timezone');
const express = require("express");
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const VOLUNTEER = mongoose.model("VOLUNTEER")
const smsNotification = require('../Functions/SMSnotification')


const GOOGLE_MAP_API = process.env.GOOGLE_MAP_API
// const googleMapsURL = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat_vol},${lng_vol}&destination=${lat_or},${lng_or}&key=${apiKey}`;


// const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY
// const mapBoxURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${lng_vol},${lat_vol};${lng_or},${lat_or}?access_token=${MAPBOX_API_KEY}`;

//-------MAP KEYs AND API_URLs-------
var limit = 3 //no of orders a volunteer can have.
// It wil

const ratingBased = async (order_id, order_location, filteredVolList_) => {

  console.log("Rating Based")
  // filteredVolList_.forEach(vol => console.log("filteredList", vol.name))
  //Assign the volunteer based on the ratings if coordinates are null
  console.log(filteredVolList_, "isArray: ", typeof(filteredVolList_))
  const maxVolunteerRating = Array.isArray(filteredVolList_)?filteredVolList_.reduce((pre, current) => {
    return (pre.volunteer_details.avg_stars > current.volunteer_details.avg_stars) ? pre : current
  }): filteredVolList_

  assign(order_id, order_location, maxVolunteerRating)
}


const assign = async (order_id, order_location, assigned_volunteer) => {
  console.log(assigned_volunteer.name)
  // console.log("order_location: ",order_location)
  const istDate = moment().tz('Asia/Kolkata').format('DD-MM-YYYY');
  const istTime = moment().tz('Asia/Kolkata').format('HH:mm:ss');

  //selection of volunteer based on: Distance,
  ORDER.findByIdAndUpdate(order_id,
    {
      assigned_vol: assigned_volunteer._id,
      order_assign_date: {
        date: istDate,
        time: istTime
      }
    }
  )

    .exec()
    .then(result => {

      console.log("result: ", assigned_volunteer.name)
      //Send SMS notification to the volunteer about the order

      const msg = `Hey,${assigned_volunteer.name}. You've assigned a/an ${result.order_type} ${result._id.toString().slice(-4)}. Login to the Medi-Share website to accept it.`
      console.log(msg)
      // smsNotification(msg, assigned_volunteer.phone_no)
      //Need to add assigned based on avg_stars (Rating)

      VOLUNTEER.findByIdAndUpdate(assigned_volunteer._id,
        {
          $push: { "volunteer_details.assigned_orders": { order_id: order_id } }
        },
        { new: true }
      ).then(result => {
        // console.log(result)
        if (result) {
          console.log(result.name, "assigned_order: ", result.volunteer_details.assigned_orders.length)
        }
      })
    })

}

const assignVolunteer = async (order_id, order_location) => {
  console.log("assignVolunteer orderLocation : ", order_location)
  let limit = 3;
  let volunteerList = [];
  
  //Remove the volunteer whose rejected_order list  has this order_id.
  while (volunteerList.length === 0) {
    volunteerList = await VOLUNTEER.find({
      "volunteer_details.verification": "verified",
      "volunteer_details.rejected_orders": { $not: { $elemMatch: { order_id: order_id } } },
      $expr: { $lte: [{ $size: { $ifNull: ["$volunteer_details.assigned_orders", []] } }, limit] }
    })
      .select("volunteer_details name phone_no")
    // console.log(vo)
    if (volunteerList.length === 0) {
      limit++; // Increase the limit
    }
  }
  console.log("limit: ", limit)


  volunteerList.forEach(vol => console.log("volunteerList", vol.name))
  const filteredVolList = volunteerList

  volunteerList.forEach(vol => console.log("filteredList", vol.name))
  if (order_location === null) {
    ratingBased(order_id, order_location, volunteerList)
  } else {
    console.log("Distance Based")
    const volunteerDistanceList = await Promise.all(volunteerList.map(async (vol) => {
      const lng_vol = vol.volunteer_details.location.lng
      const lat_vol = vol.volunteer_details.location.lat
      const lng_or = order_location.lng
      const lat_or = order_location.lat
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat_vol},${lng_vol}&destination=${lat_or},${lng_or}&key=${GOOGLE_MAP_API}`;;
      const response = await fetch(url)
      // console.log("response",response)
      const result = await response.json()
      // console.log("result", result)
      const routes = result.routes; // Access the routes property
      // console.log("routes: ", routes)
      if (routes && routes.length > 0) {
        const distance = routes[0].distance; // Access the distance of the first route
        const distanceInKm = distance / 1000;

        return {
          _id: vol._id, // Make sure to use the correct property for the volunteer ID
          distance: distanceInKm,
          name: vol.name,
          phone_no: vol.phone_no
        };
      } else {
        // Handle the case when no routes are available

        console.log('No routes found.');
        return null;
        // Or any other appropriate value
      }
    }))
    console.log(volunteerDistanceList)
    const filteredList = volunteerDistanceList.filter((item) => item != null)
    // console.log("filteredList: ",filteredList)
    if (filteredList.length > 0) {
      filteredList.sort((a, b) => a.distance - b.distance)
      const assigned_vol = filteredList[0];
      console.log("filteredList id: ", filteredList[0]._id)
      assign(order_id, order_location, assigned_vol)
    } else {
      console.log("going back to ratingBased")
      ratingBased(order_id, order_location, volunteerList)
    }
  }
  //Get the distance between the order and all the other volunteers
}

module.exports = assignVolunteer;
