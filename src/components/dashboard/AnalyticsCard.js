import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faUsers, faUserPlus } from "@fortawesome/free-solid-svg-icons"; // Import necessary icons

const AnalyticsCard = ({ title, value, icon, color }) => {
    // Choose the appropriate icon
    let selectedIcon;
    switch (icon) {
        case "fa-dollar-sign":
            selectedIcon = faDollarSign;
            break;
        case "fa-users":
            selectedIcon = faUsers;
            break;
        case "fa-user-plus":
            selectedIcon = faUserPlus;
            break;
        default:
            selectedIcon = faDollarSign;
            break;
    }

    return (
        <div className={`bg-${color}-500 text-white shadow-md rounded-lg p-6 flex items-center justify-between`}>
            <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-lg">{value}</p>
            </div>
            <div className="flex items-center justify-center p-3 bg-white rounded-full text-${color}-500">
                <FontAwesomeIcon icon={selectedIcon} className="text-3xl" />
            </div>
        </div>
    );
};

export default AnalyticsCard;
