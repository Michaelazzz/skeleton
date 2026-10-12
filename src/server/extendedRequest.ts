interface FirebaseUser {
  aud: string
  auth_time: number
  email?: string
  email_verified?: boolean
  exp: number
  firebase: {
    identities: {
      [key: string]: any
    }
    sign_in_provider: string
    sign_in_second_factor?: string
    second_factor_identifier?: string
    tenant?: string
    [key: string]: any
  }
  iat: number
  iss: string
  phone_number?: string
  picture?: string
  sub: string
  uid: string
  [key: string]: any
}

export class ExtendedRequest {
  private request: Request
  public params: { [key: string]: string } = {}
  public body: any = null
  public headers: { [key: string]: any } = {}
  public query: { [key: string]: string } = {}
  public path: string
  public method: string
  public user?: FirebaseUser

  constructor(request: Request) {
    this.request = request
    const url = new URL(this.request.url)
    this.path = url.pathname
    this.method = this.request.method.toUpperCase()
    this.parseQueryParams()
  }

  // Parses the query string and populates the `query` property
  private parseQueryParams() {
    const url = new URL(this.request.url)
    url.searchParams.forEach((value, key) => {
      this.query[key] = value
    })
  }

  // Placeholder for a body parser (for JSON bodies)
  async parseBody() {
    const contentType = this.request.headers.get("Content-Type")
    if (contentType?.includes("application/json")) {
      this.body = await this.request.json()
    }
  }

  // Getter to access the original Fetch API `Request` if needed
  getOriginalRequest(): Request {
    return this.request
  }
}
