import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import User, { IUser } from '../models/User';


const secret = 'secret';


const jwt = jsonwebtoken

export async function register(fullName: string, email: string, dateBirth: string, salary: number, phone: string, password: string, countOfTasks: number) {


    const user = await User.create({
        fullName,
        email,
        dateBirth,
        salary,
        phone,
        hashedPassword: await bcrypt.hash(password, 10),
        countOfTasks
    })


    return createToken(user);
}

export async function login(email: string, password: string) {

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email or password');

    }

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
        throw new Error('Incorrect email or password');
    }

    return createToken(user)

}

export async function findAll() {

    return User.find();
}


export async function getUserById(id: string) {

    try {
        const existing = await User.findById(id.trim())
        if (existing) {

            return existing
        } else {
            throw new Error('Employee not found')

        }

    } catch (err: any) {
        throw new Error(err)
    }

}


export async function deleteUserById(id: string) {

    return User.findByIdAndDelete(id)

}


export async function editUserById(id: string, user: IUser) {


    let existing = await User.findById(id)
    if (existing) {
        existing.email = existing.email
        existing.fullName = user.fullName
        existing.dateBirth = user.dateBirth
        existing.salary = user.salary
        existing.phone = user.phone
        existing.countOfTasks = user.countOfTasks !== undefined ? user.countOfTasks : existing.countOfTasks
        existing.tasksId = user.tasksId !== undefined ? user.tasksId : existing.tasksId
        return existing.save()
    }
}


export async function findByEmail(email: string) {
   
 return await User.findOne({ 'email': `${email}` })  
  
}




function createToken(user: any) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,

    };

    return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        accessToken: jwt.sign(payload, secret)
    };
}

