import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import companyRoutes from './routes/companyRoutes.js';

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import employeeRoutes from "./routes/employees.js"
import attendanceRoutes from './routes/attendanceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { createSurvey, getSurveYCompany, getSurveys } from './controllers/surveyController.js';
import answerRoutes from './routes/answerRoutes.js';

import feedbackRoutes from './routes/feedbackRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import deepworkRoutes from './routes/deepWorkRoutes.js';

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





app.use('/deepwork', deepworkRoutes);

app.use('/companies', companyRoutes);


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


app.get('/api/company/:companyName?', getSurveYCompany ); // Updated route definition to handle optional ID



app.use('/api', answerRoutes);


app.use('/api/users', userRoutes);


app.use('/api', messageRoutes);

app.use('/api', feedbackRoutes);



























  


app.listen(4000, () => {
    console.log('Server running on port 4000');
});
