import type { Handler } from "../server/types"

/**
 * Trie Node class represents each node in the trie tree.
 * Stores a path segment, children nodes, and the Route function.
 */
export class TrieNode<K, V> {
  children: Map<K, TrieNode<K, V>>
  isEndOfRoute: boolean
  handler: V | null

  constructor() {
    this.children = new Map<K, TrieNode<K, V>>()
    this.isEndOfRoute = false
    this.handler = null
  }
  
}
