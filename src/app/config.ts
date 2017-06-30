import { Headers, RequestOptions } from '@angular/http';

let headers = new Headers({ 'Content-Type': 'application/json'});
let BASE_URL, STRINGIFIED_PARAMS

if (window.location.origin === "http://localhost:8100") {
  BASE_URL = "http://localhost:3000/api"
  STRINGIFIED_PARAMS = "client_id=68aa5feb9038b13bb89e2623b47ec108cfb96742cf1db2e047694d5770ca16f7&grant_type=password"
} else {
  BASE_URL = "http://activemile.milestep.io:3040/api"
  STRINGIFIED_PARAMS = "client_id=a85f7339674369dd0aa5841779e1d81b39e4633a95058f56d687cd8be7bcc36f&grant_type=password"
}

export const CONFIG  = {
  BASE_URL: BASE_URL,
  STRINGIFIED_PARAMS: STRINGIFIED_PARAMS,
  OPTIONS: new RequestOptions({ headers: headers })
}
