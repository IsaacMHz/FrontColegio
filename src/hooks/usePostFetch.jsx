import { useState } from "react";

export function usePostFetch(url, token) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const executePost = (payload) => {
        setIsLoading(true);
        setError(null);

        const options = {
            method: "POST",
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

    return { data, isLoading, error, executePost };
}
