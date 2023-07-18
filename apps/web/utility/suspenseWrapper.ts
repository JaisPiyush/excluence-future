import { SuspenseWrapperResponse } from "./types";

export function suspenseWrapper<T>(promise: Promise<T>): SuspenseWrapperResponse<T> {
    let status = 'pending';
    let response: T;
    let error: any;

    const suspender = promise.then(
        (res) => {
            status = 'success';
            response = res;
        }
    ).catch((err) => {
        status = 'error';
        error = err;
    })

    return {
        read: () => {
            switch(status) {
                case "pending":
                    throw suspender;
                case "error":
                    throw error;
                default:
                    return response
            }
        }
    }
}