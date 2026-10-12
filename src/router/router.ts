import type { Handler, RequestType } from "../server/types"
import type { RouteManager } from "./route-manager"

export interface RequestTuple {
  path: string
  handler: Handler
}

export interface RouteMapper {
  get?: Array<RequestTuple>
  post?: Array<RequestTuple>
  patch?: Array<RequestTuple>
  put?: Array<RequestTuple>
  delete?: Array<RequestTuple>
  options?: Array<RequestTuple>
  head?: Array<RequestTuple>
}

/**
 * Makes a new router object
 * @returns a new router object 
 */
export function Router() {
  return new RouterMap()
}

/**
 * Router class represents a mechanism which can store controllers to handle requests sent to the server.
 * Stores a reference to the global rodute map, a local route mapper.
 */
export class RouterMap {
  private routeMap: RouteMapper
  /**
   * 
   */
  constructor () {
    this.routeMap = {}
  }

  /**
   * 
   * @param key - the request type 
   * @returns all the routes associated with a request type
   */
  getRoutes(key: RequestType): Array<RequestTuple> | undefined {
    return this.routeMap[key]
  }

  getMap(): RouteMapper {
    return this.routeMap
  }

  /**
   * Handles GET requests and delegates a handler
   * @param path - the route the request is made to
   * @param handlers - the callback function or functions that handles the request
   */
  get(path: string, handler: Handler) {
    this.delegate(path, 'GET', handler)
  }

  /**
   * Handles PUT requests and delegates a handler
   * @param path - the route the request is made to
   * @param handlers - the callback function or functions that handles the request
   */
  put(path: string, handler: Handler) {
    this.delegate(path, 'PUT', handler)
  }

  /**
   * Handles POST requests and delegates a handler
   * @param path - the route the request is made to
   * @param handlers - the callback function or functions that handles the request
   */
  post(path: string, handler: Handler) {
    this.delegate(path, 'POST', handler)
  }

  /**
   * Handles PATCH requests and delegates a handler
   * @param path - the route the request is made to
   * @param handlers - the callback function or functions that handles the request
   */
  patch(path: string, handler: Handler) {
    this.delegate(path, "PATCH", handler);
  }

  /**
   * Handles DELETE requests and delegates a handler
   * @param path - the route the request is made to
   * @param handlers - the callback function or functions that handles the request
   */
  delete(path: string, handler: Handler) {
    this.delegate(path, "DELETE", handler);
  }

  /**
   * Handles OPTIONS requests and delegates a handler
   * @param path - the route the request is made to
   * @param handlers - the callback function or functions that handles the request
   */
  options(path: string, handler: Handler) {
    this.delegate(path, "OPTIONS", handler);
  }

  /**
   * Handles HEAD requests and delegates a handler
   * @param path - the route the request is made to
   * @param handlers - the callback function or functions that handles the request
   */
  head(path: string, handler: Handler) {
    this.delegate(path, "HEAD", handler);
  }

  /**
   * Stores requests handler functions based using their request type and path as a key, 
   * so that every time the path is called the corresponding handler function can be found.
   * e.g. curl -X POST 'http://localhost:3000/test
   * @param path - the request path e.g. /test
   * @param method - the type of request e.g. POST
   * @param handlers - the function used to handle the request
   */
  private delegate(path: string, method: string, handler: Handler) {
    if (path === '/') {
      path = ''
    }
    // if (handlers.length < 1) return
    // const handler = handlers[handlers.length - 1]

    const key: RequestType = method.toLowerCase() as RequestType
    let targetMap: RequestTuple[] | undefined = this.routeMap[key]
    
    if (!targetMap) {
      this.routeMap[key] = []
      targetMap = this.routeMap[key]
    }
    targetMap.push({
      path,
      handler
    })
  }

  /**
   * Adds routes and handlers to the another router
   * @param globalPath - the global path of the route, excluding the base URL
   */
  use(globalPath: string, router: RouterMap) {
    for (const k in router.getMap()) {
      const key: RequestType = k as RequestType
      if(router[key] === undefined) return
      const reqArr: Array<RequestTuple> | undefined = router.getRoutes(key)
      if(reqArr === undefined) return
      reqArr.forEach((v, _) => {
        this.delegate(`${globalPath}${v.path}`, key, v.handler)
      })
    }
  }
}