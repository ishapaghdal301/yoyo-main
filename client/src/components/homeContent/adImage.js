import React from "react";
import './adImage.css';
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

function AdImage() {
    return (
        <div className="adImageDiv">
            <div className="offerDiv">
                <h2>Learn on your schedule</h2>
                <p>
                    Study any topic, anytime. Explore courses starting at
                    ₹455 each.
                </p>
                
            </div>
            <img
                className="adImage"
                src="https://img-b.udemycdn.com/notices/featured_banner/image_udlite/14490e9f-45d2-4095-8c5f-5fc05fe8dc84.jpg"
                alt="AdImage"
            />

        </div>
    );
}

export default AdImage;