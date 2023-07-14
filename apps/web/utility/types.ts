export type FlowUser =  {addr?: string, loggedIn: boolean | null} & Record<string, unknown>

export interface FlowAccount extends Record<string, unknown> {
    address: string;
    balance: number;

}

export type SuspenseWrapperResponse<T> = {read: () => T};