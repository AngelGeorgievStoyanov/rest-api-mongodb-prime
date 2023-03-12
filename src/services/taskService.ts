import Task, { ITask } from "../models/Task";





export async function create(task: ITask) {
    return Task.create(task)
}


export async function getAll() {
    return Task.find()
}


export async function getTaskById(id: string) {

    try {
        const existing = await Task.findById(id.trim())
        if (existing) {

            return existing
        } else {
            throw new Error('Task not found')

        }

    } catch (err: any) {
        throw new Error(err)
    }

}

export async function editTaskById(id: string, task: ITask) {


    let existing = await Task.findById(id)
    if (existing) {
        existing.title = task.title
        existing.description = task.description
        existing.deadline = task.deadline
        existing.contractor = task.contractor
        return existing.save()
    }
}

export async function deleteTaskById(id: string) {

    return Task.findByIdAndDelete(id)

}
