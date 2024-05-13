import { useState } from "react";

export function usePutFetch(url, token) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const executePut = (payload) => {
        setIsLoading(true);
        setError(null);

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        };

        fetch(url, options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((resData) => setData(resData))
            .catch((error) => setError(error.message))
            .finally(() => setIsLoading(false));
    };

    return { data, isLoading, error, executePut };
}
