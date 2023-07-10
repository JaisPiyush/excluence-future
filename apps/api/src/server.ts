import Hapi, {} from "@hapi/hapi";

import QueryString from "qs"



export const server =  Hapi.server({
    port: 8080,
    host: '0.0.0.0',
    query: {
        parser: (query) => QueryString.parse(query)
    },
    router: {
        stripTrailingSlash: true
    }
});
