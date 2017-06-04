import { Headers, RequestOptions } from '@angular/http';

let headers = new Headers({ 'Content-Type': 'application/json' })

export const CONFIG  = {
  BASE_URL: "http://localhost:3000/api",
  OPTIONS: new RequestOptions({ headers: headers }),
  STRINGIFIED_PARAMS: "client_id=69a6ecf62760323580c8dfcbca7a5756f5d47e250918f86e95de5bee722dd871&grant_type=password"
}
