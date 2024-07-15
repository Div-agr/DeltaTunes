import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Menu({ title, menuObject }) {
  const navigate = useNavigate();

  useEffect(() => {
    const allLi = document
      .querySelector('.MenuContainer ul')
      .querySelectorAll('li');

    function changeMenuActive() {
      allLi.forEach((n) => n.classList.remove('active'));
      this.classList.add('active');
    }

    allLi.forEach((n) => n.addEventListener('click', changeMenuActive));

    return () => {
      allLi.forEach((n) => n.removeEventListener('click', changeMenuActive));
    };
  }, []);

  return (
    <div className='MenuContainer'>
      <p className='title'>{title}</p>
      <ul>
        {menuObject &&
          menuObject.map((menu, index) => (
            <li
              key={index}
              onClick={() => navigate(menu.route)}
              style={{ cursor: 'pointer' }}
            >
              <i>{menu.icon}</i>
              <span>{menu.name}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export { Menu };
