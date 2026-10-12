"use strict"
import { server } from "./server/server"
import { ExtendedResponse } from "./server/extendedResponse"
import { ExtendedRequest } from "./server/extendedRequest"
import { Router } from "./router/router"
export type { MiddlewareFunction } from "./server/chain"
export { 
  server,
  Router,
  ExtendedResponse,
  ExtendedRequest
}
