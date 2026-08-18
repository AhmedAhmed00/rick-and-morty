import { setupServer } from "msw/node";
import { graphqlHandlers, handlers } from "./handlers";

export const server = setupServer(...handlers, ...graphqlHandlers);
