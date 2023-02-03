import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Adminpage.css";

export const Adminpage = () => {
  return (
    <>
      <div className="AdminNav">
        <NavLink to={"/AdminRequest"}>
          <button>Requests</button>
        </NavLink>
        <NavLink to={"/AdminDonorList"}>
          <button>Donors</button>
        </NavLink>
        <NavLink to={"/"}>
          <button>Volunteers</button>
        </NavLink>
        <NavLink to={"/"}>
          <button>Inventory</button>
        </NavLink>
      </div>

      <table>
        <tbody>
          <tr>
            <td>
              <form autoComplete="off" onsubmit="onFormSubmit()">
                <div>
                  <label htmlFor="Volunter_Name">Name</label>
                  <input type="text" name="Volunter_Name" id="Volunter_Name" />
                </div>
                <div>
                  <label htmlFor="status">status</label>
                  <input type="text" name="status" id="status" />
                </div>
                <div>
                  <label htmlFor="task">task</label>
                  <input type="text" name="task" id="task" />
                </div>
                <div className="form_action--button">
                  <input type="submit" defaultValue="Submit" />
                  <input type="reset" defaultValue="Reset" />
                </div>
              </form>
            </td>
            <td>
              <table className="list" id="storeList">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>status</th>
                    <th>task</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
