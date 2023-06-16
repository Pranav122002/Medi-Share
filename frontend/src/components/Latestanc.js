import React, { useEffect } from 'react'
import { API_BASE_URL } from "../config";
import AOS from 'aos'
import { useState } from 'react'
import "../css/LandingPage.css"

export const Latestanc = () => {

    const [annoucements, setAnnoucements] = useState([]);
    const date = new Date();
    date.setDate(date.getDate() + 2);


    useEffect(() => {
        fetchLatestAnnoucements()

    }, []);

    function isDate(dat) {
        let date2 = new Date(dat)
        console.log(date2)
        var Difference_In_Time = date2.getTime() - date.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 2;
        console.log(Difference_In_Days);
        if (Difference_In_Days < 15 && Difference_In_Days > 0) {
            return true;
        }
    }


    function fetchLatestAnnoucements() {
        fetch(`${API_BASE_URL}/all-annoucements`)
            .then((response) => response.json())
            .then((data) => setAnnoucements(data));
    }

    return (
        <div className='fbac'>
            <h1>Latest Announcements</h1>
            <div className='fbac-slidetrack'>
                {annoucements.map((annoucements) => (

                    <li className="bord" key={annoucements.title}>
                        <div className='isth'>{isDate(annoucements.date) ? (<>
                            <h3 id='anchead' >{annoucements.title}</h3>
                            <h3 className="p1">
                                {annoucements.date}
                            </h3 >
                            <h3 className="p2">
                                {annoucements.venue}
                            </h3>
                            <p className="p3">{annoucements.description} </p>
                        </>
                        ) : (
                            <div id='noneee'></div>
                        )}</div>

                    </li>
                ))}            </div>
        </div>
    )
}
