import { useEffect, useState } from "react";


export function useFetch(url){

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setIsLoading(true);

        fetch(url,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => response.json())
            .then((resData) => setData(resData))
            .catch((error) => setError(error))
            .finally(() => setIsLoading(false))
    },[url])
    
    return {data, isLoading, error};
}