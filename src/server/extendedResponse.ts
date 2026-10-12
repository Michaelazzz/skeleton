interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: any;
}

export class ExtendedResponse {
  private body: any;
  private headers: Headers;
  private statusCode: number;

  constructor() {
    this.headers = new Headers();
    this.body = null;
    this.statusCode = 200;
  }

  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  send(body: any): this {
    this.body = body instanceof Object ? JSON.stringify(body) : body;
    return this;
  }

  json<T>(body: ApiResponse<T>): this {
    this.headers.set('Content-Type', 'application/json');
    return this.send(JSON.stringify(body));
  }

  toFetchResponse(): Response {
    return new Response(this.body, {
      headers: this.headers,
      status: this.statusCode,
    });
  }
}
