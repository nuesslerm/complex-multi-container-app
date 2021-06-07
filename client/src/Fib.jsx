import { useEffect, useState } from 'react';
import axios from 'axios';

const fetchValues = async (setValues) => {
  const values = await axios.get('/api/values/current');
  setValues(values.data);
};

const fetchIndexes = async (setSeenIndexes) => {
  const seenIndexes = await axios.get('/api/values/all');
  setSeenIndexes(seenIndexes.data);
};

const onlyNumRegep = /^[0-9\b]+$/;

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  useEffect(() => {
    fetchValues(setValues);
    fetchIndexes(setSeenIndexes);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (onlyNumRegep.test(index)) {
      await axios.post('/api/values', { index });
    }

    setIndex('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="indexInput">Enter your index: </label>
        <input
          type="text"
          id="indexInput"
          value={index}
          onChange={({ target: { value } }) => {
            // if value is not blank, then test the regex; if input passes, then continue
            if (value !== '' && !onlyNumRegep.test(value)) return;
            setIndex(value);
          }}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen: </h3>
      {seenIndexes.map(({ number }) => number).join(', ')}

      <h3>Calculated values: </h3>
      {Object.entries(values).map(([key, value]) => (
        <div key={key}>
          For index {key} I calculated {value}
        </div>
      ))}
    </div>
  );
};

export default Fib;
