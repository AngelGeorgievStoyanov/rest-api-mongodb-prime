import { Schema, model, Types } from 'mongoose';

export interface IUser {
    _id?:Types.ObjectId
    fullName: string;
    email: string;
    dateBirth: Date;
    phone: string;
    salary: number;
    hashedPassword: string;
    countOfTasks: number;
    tasksId: Types.ObjectId[]
}


const userSchema = new Schema<IUser>({
    fullName: { type: String, required: [true, 'Full name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    dateBirth: { type: Date, required: true },
    phone: { type: String, required: true },
    salary: { type: Number, required: true },
    hashedPassword: { type: String, required: true },
    countOfTasks: { type: Number },
    tasksId: [{ type: Types.ObjectId, ref: 'Task' }]
});


const User = model<IUser>('User', userSchema);

export default User;
