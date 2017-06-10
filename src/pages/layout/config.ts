import { Headers, RequestOptions } from '@angular/http';

// let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer 49e76a0a4c05698bb188139228a470936c23546dcb262048c7084fb5998db015' })
let headers = new Headers({ 'Content-Type': 'application/json'});

export const CONFIG  = {
  BASE_URL: "http://localhost:3000/api",
  HEADERS: headers,
  OPTIONS: new RequestOptions({ headers: headers }),
  DEV_STRINGIFIED_PARAMS: "client_id=69a6ecf62760323580c8dfcbca7a5756f5d47e250918f86e95de5bee722dd871&grant_type=password",
  PROD_STRINGIFIED_PARAMS: "client_id= &grant_type=password"
}
