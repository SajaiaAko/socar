import React, { useState, useEffect, useRef } from 'react';
import "./App.css";

function App() {
  // State variables
  const [data, setData] = useState([]); // Stores data fetched from 'data.json'
  const [searchTerm, setSearchTerm] = useState(''); // Manages search term
  const [showNotification, setShowNotification] = useState(false); // Controls notification display
  const inputRef = useRef(null); // References the search input element
  let clickTimer; // Timer for delayed focus on search input

  // Fetching data on component mount
  useEffect(() => {
    fetch('data.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    // Set initial state and add click event listener
    setSearchTerm('');
    inputRef.current.focus(); // Focus on input field when the page loads
    window.addEventListener('click', handleClick); // Add click event listener

    // Cleanup: Remove event listener on component unmount
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Handles click events on the window
  const handleClick = () => {
    clearTimeout(clickTimer); // Clear any previous timers
    clickTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // Focus on the input field after 0.5 seconds
      }
    }, 500);
  };

  // Handles changes in the search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Copies content to clipboard and shows notification
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setShowNotification(true); // Show notification
        setTimeout(() => {
          setShowNotification(false); // Hide notification after 2 seconds
        }, 2000);
      })
      .catch((error) => {
        console.error('Unable to copy:', error);
      });
  };

  // Filters data based on search term
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define headers and their corresponding attributes
  const headers = [
    { label: 'ID', attribute: 'id' },
    { label: 'Name', attribute: 'name' },
    { label: 'AGS Number', attribute: 'numberb' },
    { label: 'Market Number', attribute: 'numbersm' },
    { label: 'Code', attribute: 'ID' },
    { label: 'Internet IP', attribute: 'ip' },
    { label: 'Router User', attribute: 'user' },
    { label: 'Router Password', attribute: 'password' },
    { label: 'Address', attribute: 'address' },
    { label: 'Latitude', attribute: 'latitude' },
    { label: 'Longtitude', attribute: 'longtitude' },
    // Add more headers and attributes as needed
  ];

  // JSX rendering
  return (
    <div>
      {/* Page title */}
      <h1>ავტოგასამართი სადგურები</h1>
      {/* Search input */}
      <div className="searchContainer">
        <input
          type="text"
          placeholder="საძიებო"
          value={searchTerm}
          onChange={handleSearch}
          className="searchInput"
          ref={inputRef}
        />
      </div>
      {/* Table displaying data */}
      <table>
        {/* Table headers */}
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header.label}</th>
            ))}
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {filteredData.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                // Render table cells
                <td 
                  key={colIndex} 
                  onClick={() => copyToClipboard(item[header.attribute])}
                >
                  <span>{item[header.attribute]}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Notification component */}
      <div className={`notification ${showNotification ? 'show' : ''}`}>
        Text Copied!
      </div>
    </div>
  );
}

export default App;
