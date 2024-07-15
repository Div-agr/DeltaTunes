import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/LeftMenu.css";
import { logo } from '../assets';
import { BiSearchAlt } from "react-icons/bi";
import { Menu } from './Menu';
import { MenuList } from './MenuList';

function LeftMenu() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery) {
      navigate(`/search?q=${searchQuery}`);
    }
  }, [searchQuery, navigate]);

  const handleFocus = () => {
    navigate(`/search?q=${searchQuery}`);
  };

  return (
    <div className='leftMenu'>
      <div className="logoContainer">
        <img src={logo} alt="" className="logoImage" />
      </div>
      <div className="searchBox">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
        />
        <i className="searchIcon">
          <BiSearchAlt />
        </i>
      </div>
      <Menu title={"Menu"} menuObject={MenuList} />
    </div>
  );
}

export { LeftMenu };
