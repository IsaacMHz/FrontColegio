import { useState } from "react";

export function usePostFetch(url){
    const [data,setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error,setError] = useState(null);

    const executePost = (payload) => {
        setIsLoading(true);
        setError(null);

        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
    }

    fetch(url,options)
        .then((response) => response.json())
        .then((resData) => setData(resData))
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false))
    
}
    return {data, isLoading, error, executePost};
}
