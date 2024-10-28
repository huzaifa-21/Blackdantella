import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faRectangleList,
  faTruckRampBox,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const Sidebar = () => {

  return (
    <aside className="sidebar">
      <div className="options">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "option active" : "option")}
        >
          <FontAwesomeIcon icon={faCirclePlus} />
          Add product
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? "option active" : "option")}
        >
          <FontAwesomeIcon icon={faRectangleList} />
          products
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) => (isActive ? "option active" : "option")}
        >
          <FontAwesomeIcon icon={faTruckRampBox} />
          Orders
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
