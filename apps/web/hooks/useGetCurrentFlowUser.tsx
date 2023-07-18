import { FlowUserContext } from "@/contexts/FlowUserContext";
import { useContext } from "react";

export const useGetCurrentFlowUser = () => {

    const user = useContext(FlowUserContext);
    return user;
}