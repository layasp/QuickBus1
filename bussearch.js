import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusSearchResult.css';

var user_id = sessionStorage.getItem("user_id");

function timechg(str) {
    const [date, time1] = str.split("T");
    const [time, x] = time1.split(".")
    return `${time}`
}

const BusSearchForm = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [busData, setBusData] = useState([]);
    const [tripData, setTripData] = useState([]);
    const [bookData, setBookData] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/api/getroutes?from=${source}&to=${destination}`);

            if (!response.ok) {
                throw new Error('Failed to fetch Route data');
            }
            const newdata = await response.json();
            setData(newdata);
            console.log("Get Route Result ********************");
            console.log(newdata);
            const busPromises = newdata.map(async (route) => {
                const busResponse = await fetch(`http://localhost:3001/api/getbus?bus_id=${route.bus_id}`);
                const newbusData = await busResponse.json();
                return newbusData;
            });

            const tripPromises = newdata.map(async (route) => {
                const tripResponse = await fetch(`http://localhost:3001/api/gettrip?r_id=${route.r_id}&tripdate=${date}`);
                const newtripData = await tripResponse.json();
                return newtripData;
            });

            const bookPromises = newdata.map(async (route) => {
                const tripResponse = await fetch(`http://localhost:3001/api/getBookingTrans?userr_id=${user_id}`);
                const newtripData = await tripResponse.json();
                return newtripData;
            });

            const busResults = await Promise.all(busPromises);
            const tripResults = await Promise.all(tripPromises);

            setBusData(busResults);
            setTripData(tripResults);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    function generateSeatButtons(totalseats) {
        const seatButtons = [];
        for (let i = 1; i <= totalseats; i += 2) {
            seatButtons.push(
                
                <div style={{ marginBottom: '10px' }} key={i}> {/* Added div as parent */}
                    <button id={i} onClick='handleSeat(11)' style={{ width:'70px', margin: '10px', marginLeft: '0px', padding: '10px' }}>
                        {`Seat ${i}`}
                    </button>
                    {i + 1 <= totalseats && (
                    <button id={i} onClick='handleSeat(11)' style={{ width:'70px', margin: '10px', marginLeft: '0px', padding: '10px' }}> 
                        {`Seat ${i + 1}`}
                    </button>
                    )}
                </div>
            );
        }
        return seatButtons;
    };
    function handleClick()
    {
        window.location='/myTransaction';
    }
    return (
        <div>
            <button style={{marginLeft: "0%"}} onClick={handleClick}>View Transactions</button>
            <h2>Search Buses</h2>
            
            <form onSubmit={handleSearch}>
                <div style={{ margin: '10px', marginLeft: '0px', padding: '10px' }}>
                    <label>Source:</label>
                    <input type="text" value={source} onChange={(e) => setSource(e.target.value)} required />
                </div>
                <div style={{ margin: '10px', marginLeft: '0px', padding: '10px' }}>
                    <label>Destination:</label>
                    <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required />
                </div>
                <div style={{ margin: '10px', marginLeft: '0px', padding: '10px' }}>
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /><br></br>
                </div>
                <button type="submit" >Search Buses</button><br></br>
            </form>


            {data.map((route, index) => (
                <div key={index}>
                    {tripData[index] && tripData[index].map((trip, tripIndex) => (
                        <div className="bus-item" key={tripIndex}>
                            {busData[index] && busData[index].map((bus, busIndex) => (
                                <div className="bus-details" key={busIndex}>
                                    <div style={{ marginBottom: '10px' }}>
                                        {`Bus Name: ${bus.bus_name}`}<br />
                                        {`Bus Number: ${bus.bus_num}`}<br />
                                        {`Bus Time: ${timechg(trip.tripdate)}`}<br />
                                      
                                        {generateSeatButtons(`${bus.tot_seats}`)}
                                        <button>Book bus</button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BusSearchForm;
