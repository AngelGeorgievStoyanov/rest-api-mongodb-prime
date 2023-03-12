import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Task, { ITask } from "../models/Task";
import { create, deleteTaskById, editTaskById, getAll, getTaskById } from "../services/taskService";


const taskController = express.Router();



taskController.post('/create', async (req: Request, res: Response) => {

    try {

        const data = Object.assign(req.body) as ITask
        const task = await create(data)

        res.status(201).json(task)
    } catch (err: any) {
        console.log(err)
        res.status(400).json(err.message)
    }

})



taskController.get('/', async (req: Request, res: Response) => {

    const tasks = await getAll()
    res.status(200).json(tasks)
})


taskController.get('/:id', async (req: Request, res: Response) => {


    try {
        const { id: id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({
                message: `No task with id :${id}`
            });
        const task = await getTaskById(id)
        res.status(200).json(task)
    } catch (err: any) {
        console.log(err)
        res.status(404).json(err.message)
    }
})


taskController.put('/:id', async (req: Request, res: Response) => {


    try {
        const { id: id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({
                message: `No task with id :${id}`
            });
        const existing = await getTaskById(id)
        if (existing) {
            try {

                const result = await editTaskById(id, req.body)

                res.status(200).json(result)
            } catch (err: any) {
                console.log(err)
                throw new Error(err)
            }
        }


    } catch (err: any) {
        console.log(err)
        res.status(404).json(err.message)
    }
})


taskController.delete('/:id', async (req: Request, res: Response) => {


    try {
        const { id: id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({
                message: `No task with id :${id}`
            });
        const existing = await getTaskById(id)
        if (existing) {
            try {

                const result = await deleteTaskById(id)

                res.status(200).json(result)
            } catch (err: any) {
                throw new Error(err)
            }
        }


    } catch (err: any) {
        console.log(err)
        res.status(404).json(err.message)
    }
})


export default taskController;