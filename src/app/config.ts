import { Headers, RequestOptions } from '@angular/http';

let headers = new Headers({ 'Content-Type': 'application/json'});
let BASE_URL, STRINGIFIED_PARAMS

if (window.location.origin === "http://localhost:8100") {
  BASE_URL = "http://localhost:3000/api"
  STRINGIFIED_PARAMS = "client_id=6587092e46c54141ba3046f3e9c44e9a0cc79fdeb6db27fb42f78959f203ef16&grant_type=password"
} else {
  BASE_URL = "http://activemile.milestep.io:3000/api"
  STRINGIFIED_PARAMS = "client_id=9d8441b6a13ac46f6f72f769c5c40b3cf0aa2af5baf2e5771af60c6370b946cb&grant_type=password"
  // for me api
  // BASE_URL = "http://activemile.milestep.io:3040/api"
  // STRINGIFIED_PARAMS = "client_id=a85f7339674369dd0aa5841779e1d81b39e4633a95058f56d687cd8be7bcc36f&grant_type=password"
}

export const CONFIG  = {
  BASE_URL: BASE_URL,
  STRINGIFIED_PARAMS: STRINGIFIED_PARAMS,
  OPTIONS: new RequestOptions({ headers: headers })
}
