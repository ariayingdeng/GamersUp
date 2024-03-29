import { React, useState } from 'react';

function SettingLevel({ level, setLevel }) {

  const [selected, setSelected] = useState(level);

  const handleChange = (e) => {
    //+:make the value a number
    setLevel(+e.currentTarget.value);
    setSelected(+e.currentTarget.value);
  };

  return (
    <div className='mb-10 pb-4'>
      <label className='block text-sm font-medium'>Your Gaming Level</label>
      <ul className='level level-ul'>
        <li>
          <input
            type='radio'
            id='newbie'
            name='level'
            value='0'
            onChange={handleChange}
            checked={selected === 0}
          />
          <label htmlFor='newbie'>Newbie</label>
        </li>
        <li>
          <input
            type='radio'
            id='veteran'
            name='level'
            value='1'
            onChange={handleChange}
            checked={selected === 1}
          />
          <label htmlFor='veteran'>Veteran</label>
        </li>
        <li>
          <input
            type='radio'
            id='pro'
            name='level'
            value='2'
            onChange={handleChange}
            checked={selected === 2}
          />
          <label htmlFor='pro'>Pro</label>
        </li>
      </ul>
    </div>
  );
}

export default SettingLevel;
