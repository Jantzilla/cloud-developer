import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
// import { TodoUpdate } from '../models/TodoUpdate';

// TODO: Implement businessLogic

// const logger = createLogger('Todos')

const bucketName = process.env.ATTACHMENT_S3_BUCKET

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todosAccess.getAllTodos()
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return await todosAccess.getTodosForUser(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const todoId = uuid.v4()

  return await todosAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  })
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    userId: string,
    todoId: string
  ) {
  
    await todosAccess.updateTodo(userId, todoId, {
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: true
    })
}

export async function deleteTodo(userId: string, todoId: string) {
  
    await todosAccess.deleteTodo(userId, todoId)
}

export async function createAttachmentPresignedUrl(todoId: string) {

    return attachmentUtils.getAttachmentUrl(todoId)
}