import express, { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { IUser } from "../models/User";
import { deleteUserById, editUserById, findAll, findByEmail, getUserById, login, register } from "../services/userService";

const authController = express.Router()



authController.post('/register', async (req: Request, res: Response) => {
    try {
        const existing = await findByEmail(req.body.email)

        if (existing) {


            throw new Error('Email is taken');
        }

        try {

            const token = await register(req.body.fullName, req.body.email, req.body.dateBirth, req.body.salary, req.body.phone, req.body.password, req.body.countOfTasks)

            res.status(201).json(token)

        } catch (err: any) {
            console.log(err)
            res.status(400).json(err.message)
        }
    } catch (err: any) {
        console.log(err)
        res.status(400).json(err.message)
    }

});



authController.post('/login', async (req: Request, res: Response) => {

    try {
        const token = await login(req.body.email, req.body.password)
        res.status(200).json(token)
    } catch (err: any) {
        console.log(err)
        res.status(401).json(err.message);
    }

})



authController.get('/top', async (req: Request, res: Response) => {

    try {
        const users = await findAll()
        let sort = users.sort((a, b) => b.countOfTasks - a.countOfTasks)
        if (sort.length > 5) {
            sort = sort.slice(0, 5);
        }
        res.status(200).json(sort);
    } catch (err: any) {
        console.log(err)
        res.status(400).json(err.message);
    }
})


authController.get('/userId/:id', async (req: Request, res: Response) => {
    try {
        const { id: id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({
                message: `No employee with id :${id}`
            });

        const user = await getUserById(id)

        if (user) {
            res.status(200).json(true);

        } else {
            res.status(401).json(false);
        }
    } catch (err: any) {
        console.log(err);
        res.status(401).json(err.message);
    }

})



authController.get('/manager/:id', async (req: Request, res: Response) => {
    try {
        const { id: id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({
                message: `No employee with id :${id}`
            });

        let manager = await findByEmail('manager@abv.bg') as any as IUser

        if (manager._id?.toString() === id) {

            res.status(200).json(true);

        } else {
            res.status(401).json(false);
        }
    } catch (err: any) {
        console.log(err);
        res.status(401).json(err.message);
    }

})


authController.get('/', async (req: Request, res: Response) => {

    try {
        const users = await findAll()
        res.status(200).json(users)
    } catch (err: any) {
        console.log(err)
        res.status(400).json(err.message);
    }
})


authController.delete('/:id', async (req: Request, res: Response) => {


    try {
        const { id: id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({
                message: `No employee with id :${id}`
            });
        const existing = await getUserById(id)
        if (existing) {
            try {

                const result = await deleteUserById(id)

                res.status(200).json(result)
            } catch (err: any) {
                throw new Error(err)
            }
        }


    } catch (err: any) {
        res.status(404).json(err.message)
    }
})


authController.get('/:id', async (req: Request, res: Response) => {


    try {
        const { id: id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({
                message: `No employee with id :${id}`
            });
        const user = await getUserById(id)
        res.status(200).json(user)
    } catch (err: any) {
        console.log(err)
        res.status(404).json(err.message)
    }
})


authController.put('/:id', async (req: Request, res: Response) => {


    try {
        const { id: id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({
                message: `No employee with id :${id}`
            });
        const existing = await getUserById(id)
        if (existing) {
            try {

                const result = await editUserById(id, req.body)

                res.status(200).json(result)
            } catch (err: any) {
                throw new Error(err)
            }
        }


    } catch (err: any) {
        res.status(404).json(err.message)
    }
})









export default authController;