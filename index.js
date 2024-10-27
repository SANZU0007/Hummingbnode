import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import User from './models/user.js';
import Scores from './models/scores.js';
import Task from './models/task.js';
import Mood from './models/mood.js';
import CheckInOutTime from './models/checkInOut.js';
import employeeRoutes from "./routes/employees.js"
import attendanceRoutes from './routes/attendanceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { createSurvey, getSurveys } from './controllers/surveyController.js';
import answerRoutes from './routes/answerRoutes.js';

import feedbackRoutes from './routes/feedbackRoutes.js';


import messageRoutes from './routes/messageRoutes.js';

import userRoutes from './routes/userRoutes.js';


const app = express();

mongoose.connect("mongodb+srv://sanjay:sanjay2023@cluster0.tjzm3y1.mongodb.net/HummingBDataService?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
 
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
});

app.use(bodyParser.json({ extended: true, limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const corsOptions = {
    origin: true, // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, sessions)
};

// Use the CORS middleware
app.use(cors(corsOptions));


app.use(cookieParser('thisisnotagoodsecret'));

const sessionOptions = {
    secret: 'thisisnotagoodsecret',
    name: 'session',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionOptions));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.json({boy:'heyyyyy', girl:'shut up'});
});




app.use('/tasks', taskRoutes);


app.use('/api', employeeRoutes);


app.use('/api/attendance', attendanceRoutes);


// app.post('/tasks/createTask', async (req, res) => {
//     try{
//             const taskData = req.body
//             const task = new Task({...taskData})
//             const user = await User.findById(taskData.author)
//             task.user = taskData.author;
//             user.tasks.push(task)
//             await task.save()    
//             await user.save()
//             return res.json({data:task, message:"Task created successfully", type:"success"})
//         } 
//     catch(err){
//         return res.json({data:null, message:err.message, type:"error"})
//     }
// })





// app.post('/tasks/completeTask', async (req, res) => {
//     try {
//         const { taskId } = req.body; // Assuming you're sending the task ID in the request body
//         const task = await Task.findById(taskId);
//         if (!task) {
//             return res.status(404).json({ data: null, message: "Task not found", type: "error" });
//         }
//         task.completed = !task.completed;
//         await task.save();

//         return res.json({ data: task, message: "Task updated successfully", type: "success" });
//     } catch (err) {
//         return res.status(500).json({ data: null, message: err.message, type: "error" });
//     }
// });



// app.post('/tasks/deleteTask', async (req, res) => {
//     try {
//         const { task } = req.body;
//         if (!task || !task._id) {
//             return res.json({ data: null, message: "Task ID is required", type: "error" });
//         }
//         const deletedTask = await Task.findByIdAndDelete(task._id);
//         if (!deletedTask) {
//             return res.json({ data: null, message: "Task not found", type: "error" });
//         }
//         if (task.user && task.user._id) {
//             await User.findByIdAndUpdate(task.user._id, { $pull: { tasks: task._id } });
//         }
//         return res.json({ data: deletedTask, message: "Task deleted successfully", type: "success" });
//     } catch (err) {
//         return res.json({ data: null, message: err.message, type: "error" });
//     }
// });




app.post('/api/surveys', createSurvey);
app.get('/api/surveys/:id?', getSurveys); // Updated route definition to handle optional ID
app.use('/api', answerRoutes);


app.use('/api/users', userRoutes);


app.use('/api', messageRoutes);

app.use('/api', feedbackRoutes);










app.get('/tasks/:index', async (req, res) => {
    try { 
        const { index } = req.params;
        
        // Fetch tasks where the user._id matches the provided index
        const tasks = await Task.find({ user: index }).populate('user');
        
        if (!tasks) {
            return res.status(404).json({ data: null, message: 'Tasks not found', type: 'error' });
        }
        
        return res.json(tasks);
    } catch (err) {
        return res.status(500).json({ data: null, message: err.message, type: 'error' });
    }
});









app.get('/getMood', async (req, res) => {
    try {
        const moods = await Mood.find().populate('user');

        return res.json({ data: moods, message: "Moods fetched successfully", type: "success" });
    } catch (err) {
        return res.json({ data: null, message: err.message, type: "error" });
    }
});


app.post('/mood', async (req, res) => {
    try {
        const moodData = req.body;

        const currentDate = new Date();
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        let mood = await Mood.findOne({
            user: moodData.author,
            date: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) } // from start of day to end of day
        });

        const user = await User.findById(moodData.author);

        if (!user) {
            return res.json({ data: null, message: "User not found", type: "error" });
        }

        if (mood) {
            mood.data = moodData.mood;
        } else {
            mood = new Mood({
                data: moodData.mood,
                date: startOfDay,  
                user: moodData.author
            });
            user.mood.push(mood);
        }
        await mood.save();
        await user.save();

        return res.json({ data: mood, message: "Performance updated successfully", type: "success" });
    } catch (err) {
        return res.json({ data: null, message: err.message, type: "error" });
    }
});



app.get('/getCheckInOut/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; 
  
      const today = new Date();
      const todayDateOnly = new Date(today.setHours(0, 0, 0, 0));
  
      const user = await User.findById(userId).populate('checkInOutHistory');
  
      const checkInOutData = user.checkInOutHistory.find((record) => {
        const checkInDateOnly = new Date(record.checkIn).setHours(0, 0, 0, 0);
        return checkInDateOnly === todayDateOnly.getTime(); 
      });
  
      if (!checkInOutData) {
        return res.status(200).json({data:{
          checkIn: "",
          checkOut: "",
          user: userId
        }, message:"Got check-in-out successfully", type:"success"});
      }
  
      return res.status(200).json({data:checkInOutData, message:"Got check-in-out successfully", type: "success"});
    } catch (error) {
      console.error('Error fetching check-in/out data:', error);
      return res.status(500).json({
        message: "Internal Server Error",
        type: "error",
        error: error.message
      });
    }
  });
  

app.post('/setCheckInOut', async (req, res) => {
    try {
      const { user, checkIn, checkOut } = req.body;
      const userFetched = await User.findById(user);
      console.log(req.body)
 
      if (!userFetched) {
        return res.status(404).json({ message: "User not found", type: "error" });
      }
  
      const checkInDate = new Date(checkIn).setHours(0, 0, 0, 0);
  
      let existingRecord = await CheckInOutTime.findOne({
        user: user,
        checkIn: {
          $gte: new Date(checkInDate),
          $lt: new Date(checkInDate + 24 * 60 * 60 * 1000) 
        }
      });
  
      if (existingRecord) {
        existingRecord.checkIn = checkIn; 
        existingRecord.checkOut = checkOut; 
        await existingRecord.save();
  
        return res.json({
          data: existingRecord,
          message: "Check-in/out time updated successfully.",
          type: "success"
        });
      }
  
      const checkInOutRecord = new CheckInOutTime({
        checkIn,
        checkOut,
        user: user
      });
  
      await checkInOutRecord.save();
  
      userFetched.checkInOutHistory.push(checkInOutRecord._id);
      await userFetched.save();
  
      return res.json({
        data: checkInOutRecord,
        message: "Successfully Checked-In/Out",
        type: "success"
      });
    } catch (error) {
      console.error('Error setting check-in/out time:', error);
      return res.status(500).json({
        message: "Internal Server Error",
        type: "error",
        error: error.message
      });
    }
  });
  

  app.get('/getUserData', async (req, res) => {
    try {
      const users = await User.find().populate('checkInOutHistory').exec();
  
      res.status(200).json({data:users, type:"success"});
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


app.listen(4000, () => {
    console.log('Server running on port 4000');
});
