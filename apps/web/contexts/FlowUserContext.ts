import { FlowUser } from "@/utility/types";
import { createContext } from "react";

export const FlowUserContext = createContext<FlowUser>({loggedIn: null});