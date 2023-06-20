require('dotenv').config();
const moment = require('moment-timezone');
const express = require("express");
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const VOLUNTEER = mongoose.model("VOLUNTEER")
const smsNotification = require('../Functions/SMSnotification')

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY

var global_assigned_volunteer

const ratingBased = async (order_id, order_location,filteredList) => {
  console.log("Rating Based")
  console.log("ratingBased Filter: ", filteredList)
    //Assign the volunteer based on the ratings if coordinates are null
    const maxVolunteerRating = filteredList.reduce((pre, current) => {
      return (pre.volunteer_details.avg_stars > current.volunteer_details.avg_stars) ? pre : current
    })
    global_assigned_volunteer = maxVolunteerRating
    console.log("Saving the volunteer: ", global_assigned_volunteer)
    assign(order_id, order_location, maxVolunteerRating)
}


const assign = async (order_id, order_location, assigned_volunteer) => {
  console.log(assigned_volunteer)
  console.log("order_location: ",order_location)
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
      console.log("result: ", assigned_volunteer)
      //Send SMS notification to the volunteer about the order

      const msg = `Hey,${assigned_volunteer.name}. You've assigned a/an ${result.order_type} ${result._id.toString().slice(-4)}. Login to the Medi-Share website to accept it.`
      console.log(msg)
      // smsNotification(msg, assigned_volunteer.phone_no)
      //Need to add assigned based on avg_stars (Rating)
    })

}

const assignVolunteer = async (order_id, order_location) => {
  console.log("assignVolunteer")
  const volunteerList = await VOLUNTEER.find({})
    .select("volunteer_details name phone_no")
  console.log(volunteerList)
  //Remove the volunteer whose rejected_order list the order_id.
  const filteredVolList = volunteerList.filter((vol) => {
    return vol.volunteer_details.rejected_orders &&
      vol.volunteer_details.rejected_orders.every(order => order.order_id !== order_id);

  })


  // console.log("filteredVolList: ", filteredVolList)
  if (order_location === null) {
    ratingBased(filteredVolList)
  } else {
    console.log("Distance Based")
    const volunteerDistanceList = await Promise.all(filteredVolList.map(async (vol) => {
      const lng_vol = vol.volunteer_details.location.lng
      const lat_vol = vol.volunteer_details.location.lat
      const lng_or = order_location.lng
      const lat_or = order_location.lat
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${lng_vol},${lat_vol};${lng_or},${lat_or}?access_token=${MAPBOX_API_KEY}`;
      const response = await fetch(url)
      // console.log("response",response)
      const result = await response.json()
      // console.log("result",result)
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
      console.log("filteredList id: ",filteredList[0]._id)
      assign(order_id, order_location, assigned_vol)
    } else {
      console.log("going back to ratingBased")
      ratingBased(order_id, order_location, filteredVolList)
    }
  }
  //Get the distance between the order and all the other volunteers
}

module.exports = assignVolunteer;
