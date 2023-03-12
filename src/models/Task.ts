import { Schema, model,  isObjectIdOrHexString, ObjectId, Types } from 'mongoose';

export interface ITask {
    title: string;
    description: string;
    contractor: Types.ObjectId[];
    deadline: Date;
}


const taskShema = new Schema<ITask>({
    title: { type: String, required: [true, 'Title is required'] },
    description: { type: String, required: [true, 'Description is required'], unique: true },
    contractor: [{ type: Types.ObjectId, ref: 'User'}],
    deadline: { type: Date, required: true },
});



const Task = model<ITask>('Task', taskShema);

export default Task;