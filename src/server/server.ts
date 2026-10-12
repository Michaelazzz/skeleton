import type { Server } from "bun"
import { Router } from "../router/router"
import type { Handler, RequestType } from "./types"
import { isRequestType } from "./types"
import { RouteManager } from "../router/route-manager"
import { Chain, type MiddlewareFunction } from "./chain"
import { ExtendedRequest } from "./extendedRequest"
import { ExtendedResponse } from "./extendedResponse"
import type { RequestTuple, RouterMap } from "../router/router"

export interface SSLOptions {
  reusePort: boolean
  keyFile: string
  certFile: string
  passphrase?: string
  caFile?: string
  dhParamsFile?: string

  /**
   * This sets `OPENSSL_RELEASE_BUFFERS` to 1.
   * It reduces overall performance but saves some memory.
   * @default false
   */
  lowMemoryMode?: boolean
}

/**
 * Make the server instance avilable to outside classes 
 * @returns the instance of the bun server
 */
export function server() {
  return BunServer.instance;
}

class BunServer {
  private static server?: BunServer

  private readonly routeManager: RouteManager
  private readonly middlewares: MiddlewareFunction[] = []
  private readonly errorHandlers: Handler[] = []

  /**
   * Creates a singleton bunserver
   */
  constructor() {
    this.routeManager = new RouteManager()

    if(BunServer.server) {
      throw new Error('server is already constructed')
    }
    BunServer.server = this
  }

  /**
   * @returns the server instance
   */
  static get instance() {
    return BunServer.server ?? (BunServer.server = new BunServer())
  }

  /**
   * Add middlewaren to server
   * @param middleware
   */
  use(middleware: Handler): void

  /**
   * Attach router to server
   * @param path
   * @param router
   */
  use(path: string, router: RouterMap): void

  /**
   * Attch middleware, router, or global error handler
   * @param arg1 - route represented as a string, handler function or middleware function
   * @param arg2 - an optional argument for when adding a router
   */
  use(arg1: string | Handler | MiddlewareFunction, arg2?: RouterMap) {
    // add routes to global route manager
    if (arg2 && typeof arg1 === "string") {
      this.attach(arg1, arg2)
    }
    // pass middleware or global error handler
    else {
      if (arg1.length === 3) {
        this.middlewares.push(arg1 as MiddlewareFunction)
      } else if (arg1.length === 4) {
        this.errorHandlers.push(arg1 as Handler)
      }
    }
  }

  /**
   * Attaches routes and handlers to the global tree
   * @param globalPath - the global path of the route, excluding the base URL
   */
  attach(globalPath: string, router: RouterMap) {
    for (const k in router.getMap()) {
      const key: RequestType = k as RequestType
      if(router[key] === undefined) return
      const reqArr: Array<RequestTuple> | undefined = router.getRoutes(key)
      if(reqArr === undefined) return
      reqArr.forEach((v, _) => {
        this.routeManager.addRoute(key, `${globalPath}${v.path}`, v.handler)
      })
    }
  }

  useMiddleware(middleware: MiddlewareFunction) {
    this.middlewares.push(middleware)
  }

  listen(
    port: string | number,
    callback?: () => void,
    options?: SSLOptions
  ): Server {
    const baseUrl = `http://localhost:${port}`
    callback?.call(null)
    return this.startServer(port, baseUrl, options)
  }

  private startServer (
    port: string | number,
    baseUrl: string,
    options?: SSLOptions
  ): Server {
    const that = this
    return Bun.serve({
      port,
      reusePort: options?.reusePort,
      keyFile: options?.keyFile,
      certFile: options?.certFile,
      passphrase: options?.passphrase,
      caFile: options?.caFile,
      dhParamsFile: options?.dhParamsFile,
      lowMemoryMode: options?.lowMemoryMode,
      development: process.env.SERVER_ENV !== "production",
      async fetch(req: Request, server?: Server) {
        const extendedReq: ExtendedRequest = new ExtendedRequest(req)
        const extendedRes = new ExtendedResponse()

        // remove trailing /
        if (extendedReq.path.endsWith('/')) {
          extendedReq.path = extendedReq.path.slice(0, extendedReq.path.length)
        }

        // check request method
        if(!isRequestType(extendedReq.method.toLowerCase())) {
          extendedRes.status(500).send(`invalid request`)
          return extendedRes.toFetchResponse()
        }

        const key: RequestType = req.method.toLowerCase() as RequestType
        // get handler for the route
        const handler: Handler | null = that.routeManager.getHandler(key, extendedReq.path)
        
        if (handler === null) {
          console.error(`Cannot find ${req.method} ${extendedReq.path}`)
          extendedRes.status(404).send(`${req.method} ${extendedReq.path} with a 404`)
          return extendedRes.toFetchResponse()
        } else {
          console.log(`${server?.requestIP(req)}::${key}::${extendedReq.path}`)
        }
        
        // run middleware
        if (that.middlewares.length !== 0) {
          const chain = new Chain(that.middlewares)
          await chain.run(extendedReq, extendedRes)
        }

        const response = (handler as Function).apply(that, [extendedReq, extendedRes])
        if (response instanceof Promise) {
          await response
        }
        return extendedRes.toFetchResponse()
      },
      error(err: Error) {
        const extendedRes = new ExtendedResponse
        // next here is to ignore the error
        const next = () => {}
        that.errorHandlers.forEach((handler) => {
          // * no request object pass to error handler
          (handler as Function).apply(that, [null, extendedRes, err, next])
        })

        return extendedRes.toFetchResponse()
      }
    })
  }
}