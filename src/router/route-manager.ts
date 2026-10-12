import { TrieTree } from "../trie-tree/trie-tree"
import type { Handler, RequestType } from "../server/types"

export class RouteManager {
  /** A trie tree for each request type */
  get?: TrieTree<string, Handler>
  post?: TrieTree<string, Handler>
  patch?: TrieTree<string, Handler>
  put?: TrieTree<string, Handler>
  delete?: TrieTree<string, Handler>
  options?: TrieTree<string, Handler>
  head?: TrieTree<string, Handler>

  /**
   * Adds a route to the route manager
   * @param type - the request type of the route
   * @param path - the path of the route
   * @param handler - the handler function that will be associated with the path
   */
  addRoute (type: RequestType, path: string, handler: Handler): void {
    let targetTree: TrieTree<string, Handler> = this.getTrieTree(type)
    targetTree.addRoute(path, handler)
  }

  /**
   * Gets a handler function for a route
   * @param type - the request type of the route
   * @param path - the path e.g. user/getDetails
   * @returns a function that handles a request to the route
   */
  getHandler (type: RequestType, path: string): Handler | null {
    let targetTree: TrieTree<string, Handler> | undefined = this.readTrieTree(type)
    if(targetTree === undefined) {
      return null
    }
    return targetTree.findHandler(path)
  }

  /**
   * Method to dynamically access the class properties.
   * If specified property is undefined a new one is created and returned.
   * @param method The HTTP method (e.g., 'get', 'post', etc.)
   */
  private getTrieTree(method: 'get' | 'post' | 'patch' | 'put' | 'delete' | 'options' | 'head'): TrieTree<string, Handler> {
    this[method] = this[method] ?? new TrieTree<string, Handler>()
    return this[method] as TrieTree<string, Handler>
  }

  /**
   * Method to dynamically access the class properties.
   * @param method The HTTP method (e.g., 'get', 'post', etc.)
   */
  private readTrieTree(method: 'get' | 'post' | 'patch' | 'put' | 'delete' | 'options' | 'head'): TrieTree<string, Handler> | undefined {
    return this[method] as TrieTree<string, Handler> | undefined
  }

}