import { FlowUserContext } from "@/contexts/FlowUserContext";
import { FlowUser } from "@/utility/types";
import { ReactNode, useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";

export default function FlowUserProvider(props: {children: ReactNode}) {
    const [user, setUser] = useState<FlowUser>({loggedIn: null});

    useEffect(() => {
        const unSubscribe = fcl.currentUser.subscribe(setUser);

        return () => {
            unSubscribe();
        }
    }, [])

    return <FlowUserContext.Provider value={user}>
                {props.children}
            </FlowUserContext.Provider>
}