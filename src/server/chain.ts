import type { ExtendedRequest } from "./extendedRequest"
import type { ExtendedResponse } from "./extendedResponse"

export type MiddlewareFunction = (
  req: ExtendedRequest,
  res: ExtendedResponse,
  next: (err?: Error) => Promise<void>
) => Promise<void>

export class Chain {
  private middlewares: MiddlewareFunction[]

  constructor(middlewares: MiddlewareFunction[]) {
    this.middlewares = middlewares
  }

  async run(req: ExtendedRequest, res: ExtendedResponse): Promise<void> {
    // Start processing with the first middleware
    await this.executeMiddleware(0, req, res)
  }

  private async executeMiddleware(index: number, req: ExtendedRequest, res: ExtendedResponse, err?: Error): Promise<void> {
    if (err) {
      throw err
    }

    if (index < this.middlewares.length) {
      const middleware = this.middlewares[index]
      try {
        // Call the current middleware, passing the context and the next function
        await middleware(req, res, async (nextErr?: Error) => {
          // if there's an error, pass it to the next middleware
          await this.executeMiddleware(index + 1, req, res, nextErr)
        })
      } catch (e) {
        // If an error is thrown, stop and propagate it
        throw e
      }
    }
  }
}