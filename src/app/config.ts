import { Headers, RequestOptions } from '@angular/http';

// let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer 49e76a0a4c05698bb188139228a470936c23546dcb262048c7084fb5998db015' })
let headers = new Headers({ 'Content-Type': 'application/json'});
let BASE_URL, STRINGIFIED_PARAMS

if (window.location.origin === "http://localhost:8100") {
  BASE_URL = "http://localhost:3000/api"
  STRINGIFIED_PARAMS = "client_id=69a6ecf62760323580c8dfcbca7a5756f5d47e250918f86e95de5bee722dd871&grant_type=password"
  // for old ubuntu
  // STRINGIFIED_PARAMS = "client_id=5df29aa9d2ec6384c4059ffd675c5e387ad0b90697c884c2e82ef25826062f60&grant_type=password"
} else {
  BASE_URL = "http://activemile.milestep.io/api"
  STRINGIFIED_PARAMS = "client_id=a85f7339674369dd0aa5841779e1d81b39e4633a95058f56d687cd8be7bcc36f&grant_type=password"
}

export const CONFIG  = {
  BASE_URL: BASE_URL,
  STRINGIFIED_PARAMS: STRINGIFIED_PARAMS,
  HEADERS: headers,
  OPTIONS: new RequestOptions({ headers: headers })
}
