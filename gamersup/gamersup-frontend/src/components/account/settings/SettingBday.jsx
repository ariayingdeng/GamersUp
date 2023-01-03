import { React, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function SettingBday({ birthday, setBirthday }) {

  const [newBirthday, setNewBirthDay] = useState(new Date());

  useEffect(() => {
    if (birthday !== null) {
      setNewBirthDay(new Date(birthday));
    } 
  }, []);

  const handleChangeBd = (newDate) => {
    setBirthday(new Date(newDate));
    setNewBirthDay(new Date(newDate));
  };

  return (
    <div className='mb-10 pb-4'>
      <label className='block text-sm font-medium'>Your Birthday</label>
      <div className='mt-5 relative'>
        <DatePicker
          className='w-full pr-40 bg-gray-200 rounded h-14 text-black'
          selected={newBirthday}
          id='datepicker'
          onChange={(newDate) => handleChangeBd(newDate)}
          showYearDropdown
        />
      </div>
    </div>
  );
}

export default SettingBday;
