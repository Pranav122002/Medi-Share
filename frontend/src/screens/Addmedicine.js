import React from 'react'
import "../css/Addmedicine.css"

export default function Addmedicine() {

    const formEl = document.querySelector("form");
    const tbodyEl = document.querySelector("tbody");
    const tableEl = document.querySelector("table");
    function onAddWebsite(e) {
      e.preventDefault();
      const website = document.getElementById("website").value;
      const expiry = document.getElementById("expiry").value;
      const Quantity = document.getElementById("Quantity").value;
      tbodyEl.innerHTML += `
          <tr>
              <td>${website}</td>
              <td>${expiry}</td>
              <td>${Quantity}</td>
              <td><button class="deleteBtn">Delete</button></td>
          </tr>
      `;
    }

    function onDeleteRow(e) {
      if (!e.target.classList.contains("deleteBtn")) {
        return;
      }

      const btn = e.target;
      btn.closest("tr").remove();
    }

    formEl.addEventListener("submit", onAddWebsite);
    tableEl.addEventListener("click", onDeleteRow);


  return (
    <>
    <form>
      <div class="input-row">
        <label for="website">Medicine_Name</label>
        <input type="text" name="website" id="website" />
      </div>
      <div class="input-row">
        <label for="exipry">Expire_Date</label>
        <input type="date" name="expiry_date" id="expiry" min="2023-03-03"/>
      </div>
      <div class="input-row">
        <label for="exipry">Quantity</label>
        <input type="text" name="Quantity" id="Quantity"/>
      </div>
      
      <button>Submit</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>Medicine_Name</th>
          <th>Expire_Date</th>
          <th>Quantity</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    </>
  )
}
