import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


var user_id = sessionStorage.getItem("user_id");


const MyTransactionForm = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [busData, setBusData] = useState([]);
    const [tripData, setTripData] = useState([]);
    const [bookData, setBookData] = useState([]);

    useEffect(() => {
        handleSearch();
    }, []); // This will trigger handleSearch() once when the component mounts

    const handleSearch = async () => {
        console.log("Entered into My Transaction");
        //e.preventDefault();
        try {

            const response = await fetch(`http://localhost:3001/api/getBookingTrans?user_id=${user_id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch Route data');
            }
            const newdata = await response.json();
            setData(newdata);
            console.log("Get Route Result ********************");
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    return (
        
        <div>
            <p>MY TRANSACTIONS</p>
            {data.map((transaction, index) => (
                <div key={index}>
                    {`Passenger Name: ${transaction.passenger_name}`}<br />
                    {`Passenger Age: ${transaction.passenger_age}`}<br />
                    {`Passenger Gender: ${transaction.passenger_gender}`}<br />
                    {`Seat : ${transaction.seat_id}`}<br />
                </div>
            ))}
        </div>
     
    );
};


export default MyTransactionForm;
