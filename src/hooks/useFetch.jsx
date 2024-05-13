import { useEffect, useState } from "react";

export function useFetch(url, token) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setIsLoading(true);

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((resData) => {
            setData(resData);
        })
        .catch((error) => {
            setError(error.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [token, url]);
    
    return { data, isLoading, error };
}
