import express from 'express';
import mongoose from 'mongoose';
import pkg from 'mongoose';
const { connect, connection } = pkg;
import cors from 'cors';


mongoose.pluralize(null);
const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const mongoURI = 'mongodb+srv://srilayasekar:N94MjeJofaXNAHbl@busbooking.znpw4t3.mongodb.net/QuickBus?retryWrites=true&w=majority&appName=BusBooking';
connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const getRouteSchema = new mongoose.Schema({
    from: String,
    to: String
});

const getTripSchema = new mongoose.Schema({
    route_id: String,
    tripdate: Date
});

const getBusSchema = new mongoose.Schema({
    bus_name: String,
    bus_num: String,
    bus_id: String,
    tot_seats: String
});

const userSchema = new mongoose.Schema({
    user_id: String,
    user_name: String,
    user_email: String,
    password: String
});

const getBookingSchema = new mongoose.Schema({
    booking_id: String,
    user_id: String,
    trip_id: String,
    seat_id: String,
    passenger_name: String,
    passenger_id: String,
    passenger_age: String,
    passenger_gender: String

});

const Route = mongoose.model('route', getRouteSchema);
const Trip = mongoose.model('trip', getTripSchema);
const Bus = mongoose.model('bus', getBusSchema);
const Booking = mongoose.model('booking', getBookingSchema);
const User = mongoose.model('user', userSchema);

app.use(cors());
app.use(express.json());


app.get('/api/searchroutes', async (req, res) => {
    try {
        const getroutedata = await Trip.find({
            from: req.query.from,
            to: req.query.to,
            tripdate: { "$gt": req.query.tripdate, "$lt": req.query.tripdate + 1 }
        });
        console.log("search routes");
        await getroutedata.forEach(console.dir);
        res.json(getroutedata);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/getroutes', async (req, res) => {
    try {
        const getroutedata = await Route.find({
            from: req.query.from,
            to: req.query.to
        });
        console.log("getroutes");
        await getroutedata.forEach(console.dir);
        res.json(getroutedata);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/getBookingTrans', async (req, res) => {
    try {
        const getroutedata = await Booking.find({
            user_id: req.query.user_id
            //user_id: "sri"
        });
        console.log("getBookingTrans");
        await getroutedata.forEach(console.dir);
        res.json(getroutedata);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/getbus', async (req, res) => {
    try {
        const getbusdata = await Bus.find({
            bus_id: req.query.bus_id
        });
        console.log("getbus");
        await getbusdata.forEach(console.dir);
        res.json(getbusdata);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/gettrip', async (req, res) => {
    try {
        const startOfDay = new Date(req.query.tripdate); // Get the start of the selected day
            const endOfDay = new Date(startOfDay); // Create a copy of the start date
            endOfDay.setDate(endOfDay.getDate() + 1);
        const gettripdata = await Trip.find({
            r_id: req.query.r_id,

                tripdate: {
                    $gte: startOfDay, // Greater than or equal to the start of the selected day
                    $lt: endOfDay // Less than the start of the next day
                }
            
        });
console.log("********************** gettrip");
await gettripdata.forEach(console.dir);
res.json(gettripdata);
    } catch (error) {
    console.error('Error fetching Trip data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

app.post('/api/register', async (req, res) => {
    try {
        const user_id ="3";
      const { user_email, user_name, password } = req.body;
      console.log("hello");
      const newLeaderboardEntry = new User({user_id ,user_email, user_name, password });
      const savedLeaderboardEntry = await newLeaderboardEntry.save();
      console.log(user_email);
      res.json(savedLeaderboardEntry);
      
    } catch (error) {
      console.error('Error saving user entry:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
