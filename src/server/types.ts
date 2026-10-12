import type { ExtendedRequest } from "./extendedRequest"
import type { ExtendedResponse } from "./extendedResponse"

export type Handler = (
  req: ExtendedRequest,
  res: ExtendedResponse,
  next?: (err?: Error) => {},
  err?: Error
) => void | Promise<any>
  
export type Route = (
  handler: Handler,
  middlewareFunctions?: Handler[]
) => void | Promise<any>

export type RequestMethodType = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD'

export type RequestType = 'get' | 'put' | 'post' | 'delete' | 'patch' | 'options' | 'head'
export function isRequestType(value: string): value is RequestType {
  return ['get', 'put', 'post', 'delete', 'patch', 'options', 'head'].includes(value)
}

export type RequestHandler = (path: string, ...handlers: Handler[]) => void

export type Middleware = {
  path: string
  middlewareFunction: Handler
}