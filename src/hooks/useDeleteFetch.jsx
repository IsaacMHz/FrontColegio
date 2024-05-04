import { useState } from "react";

export function useDeleteFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeDelete = (id) => {
    setIsLoading(true);
    setError(null);

    const deleteUrl = `${url}${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    };

    fetch(deleteUrl, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el alumno');
        }
        return response.json();
      })
      .then((resData) => setData(resData))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  };

  return { data, isLoading, error, executeDelete };
}
