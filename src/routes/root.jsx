import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from 'react'

export default function Root() {  

    let location = useLocation();
    const navigate = useNavigate();


    
    return (
        <div className= "landing-main" id= "landing-main">
            <p className= "contact-details"> mnjoshi+w@ualberta.ca </p>
            <div className= "landing-central">
                <p className= "landing-welcome" id= "landing-welcome"></p>
            </div>
            <div className= "landing-outlet" id= "landing-outlet">
            </div>
      </div>
    );
  }