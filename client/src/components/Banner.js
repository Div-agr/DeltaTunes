import React from 'react';
import { singer } from '../assets';
import { AiOutlineStock } from "react-icons/ai";
import { IoPlaySharp } from "react-icons/io5";

function Banner() {
  return (
    <div className='banner'>
      <img src={singer} alt="Singer" className='bannerImg' />
      <div className='bannerText'>Featuring most listened</div>
      <div className='artistName'>Arijit Singh</div>
      <button className='playButton'>Play Song</button>
      <div className='stats'>
        <div><AiOutlineStock className="icon" /> Followers: 1.2M</div>
        <div><IoPlaySharp className="icon" /> Plays: 45M</div>
      </div>
    </div>
  );
}

export { Banner };
