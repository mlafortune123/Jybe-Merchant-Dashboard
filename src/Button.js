import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Button = ({ type, size, icon, state, className, text = "Button text", onClick }) => {
  return (
    <div onClick={onClick} className={`button ${type} ${icon} ${size} ${state} ${className}`}>
      {["false", "left", "right"].includes(icon) && <div className="text">{text}</div>}
        <img src="/rightarrow.png" alt="rightarrow" />
    </div>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["secondary", "circular", "inverted", "primary", "outlined"]),
  size: PropTypes.oneOf(["xl", "xs", "lg", "sm", "md"]),
  icon: PropTypes.oneOf(["false", "right", "only", "left"]),
  state: PropTypes.oneOf(["default", "hover", "focus"]),
  text: PropTypes.string
};
