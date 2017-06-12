import { Headers, RequestOptions } from '@angular/http';

// let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer 49e76a0a4c05698bb188139228a470936c23546dcb262048c7084fb5998db015' })
let headers = new Headers({ 'Content-Type': 'application/json'});

export const CONFIG  = {
  // for localhost
  BASE_URL: "http://localhost:3000/api",
  DEV_STRINGIFIED_PARAMS: "client_id=69a6ecf62760323580c8dfcbca7a5756f5d47e250918f86e95de5bee722dd871&grant_type=password",

  // for activemile
  // BASE_URL: "http://activemile.milestep.io/api",
  // DEV_STRINGIFIED_PARAMS: "client_id=a85f7339674369dd0aa5841779e1d81b39e4633a95058f56d687cd8be7bcc36f&grant_type=password",

  HEADERS: headers,
  OPTIONS: new RequestOptions({ headers: headers }),
  PROD_STRINGIFIED_PARAMS: "client_id= &grant_type=password"
}
