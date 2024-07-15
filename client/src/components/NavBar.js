import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

function NavBar() {

    const navigate= useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const handleClick = (index,text) => {
        setActiveIndex(index);
        navigate("/"+text);

      };
  return (
    
    <div className='navbar'>
        {['Home', 'Artists', 'Top Hits', 'New and Popular'].map((text, index) => (
          <span
            key={index}
            className={activeIndex === index ? 'active' : ''}
            onClick={() => handleClick(index,text)}
          >
            {text}
          </span>
        ))}
    </div>
  )
}

export {NavBar}