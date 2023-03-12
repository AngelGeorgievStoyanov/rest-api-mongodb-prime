import express from "express";
import cors from 'cors';
import logger from 'morgan';
import mongoose from "mongoose";
import authController from "./controllers/authController";
import bodyParser from "body-parser";
import taskController from "./controllers/taskController";
import { register } from "./services/userService";
import { manager } from "./manager";
import User from "./models/User";


const hostname: string = 'localhost';
const port: number = 5000;
const dbname = 'task-manager'
const connectionString = `mongodb://localhost:27017/${dbname}`;


start()

async function start() {

    try {
        await mongoose.connect(connectionString)
        console.log(`Database ${dbname} connected!`)
    } catch (err: any) {
        throw new Error(err.message)
    }


    const app = express();

    app.use(cors({
        origin: '*',
        methods: 'GET,POST,PUT,DELETE'
    }))
    app.use(logger('dev'))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 100000 }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.raw({ limit: '50mb', inflate: true }))


    app.get('/', (req, res) => {
        res.json({ message: `TEST -> REST service operational at ${port}` });
    });


    app.use('/users', authController);
    app.use('/tasks', taskController);


    app.listen(port, hostname, (() => {
        console.log(`HTTP Server listening on: http://${hostname}:${port}`);

    }))

    const managerExsisting = await User.findOne({ 'email': 'manager@abv.bg' });
    if (!managerExsisting) {
        register(manager.fullName, manager.email, manager.dateBirth, manager.salary, manager.phone, manager.password, manager.countOfTasks)
        console.log('Manager created')
    }

    app.on('error', err => {
        console.log('Server error:', err);
    });
}