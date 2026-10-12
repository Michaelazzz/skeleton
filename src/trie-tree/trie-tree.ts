import type { Handler } from "../server/types"
import { TrieNode } from "./trie-node"

export class TrieTree<K extends string, V extends Handler> {
  private readonly root: TrieNode<K, V>

  constructor() {
    this.root = new TrieNode()
  }

  /** 
   * Adds a route to the tree
   * @param path - the route global path
   * @param handler - the handler function assoiated with the path
  */
  addRoute(path: string, handler: Handler): void {
    if (path === '*') {
      path = '/'
    }
    const segments: string[] = this.parseRoute(path)
    let currentNode: TrieNode<string, Handler> = this.root

    for(const segment of segments) {
      if (!currentNode.children.has(segment)) {
        currentNode.children.set(segment, new TrieNode<string, Handler>())
      }
      currentNode = currentNode.children.get(segment)!
    }
  
    currentNode.isEndOfRoute = true
    currentNode.handler = handler
  }

  /**
   * Retrieves a handler function for a route
   * @param route - a path in the tree
   * @returns a handler function which corresponds with the path
   */
  findHandler (route: string): Handler | null {
    const segments = this.parseRoute(route) as K[]
    let currentNode = this.root

    for (const segment of segments) {
      if (!currentNode.children.has(segment)) {
        return null
      }
      currentNode = currentNode.children.get(segment)!
    }
    return currentNode.isEndOfRoute ? currentNode.handler : null
  }

  /**
   * A hepler function for splitting a path into segments
   * @param route - a path in the API e.g. /user/getDetails
   * @returns an array of strings which contain the parts of the path that splits on a '/' e.g. ['user', 'getDetails']
   */
  private parseRoute(route: string): string[] {
    return route.split('/').filter(segment => segment.length > 0);
  }
}
