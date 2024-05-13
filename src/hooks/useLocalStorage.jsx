import { useState } from 'react';

export const useLocalStorage = (localStorageKey) => {
    const getStoredValue = () => {
        try {
            const storedValueString = localStorage.getItem(localStorageKey);
            return storedValueString ? JSON.parse(storedValueString) : null;
        } catch (error) {
            console.error(`Error al obtener el valor del localStorage para la clave ${localStorageKey}:`, error);
            return null;
        }
    };

    const [storedValue, setStoredValue] = useState(getStoredValue());

    const saveValue = (value) => {
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(value));
            setStoredValue(value);
        } catch (error) {
            console.error(`Error al guardar el valor en el localStorage para la clave ${localStorageKey}:`, error);
        }
    };

    const clearValue = () => {
        try {
            localStorage.removeItem(localStorageKey);
            setStoredValue(null);
        } catch (error) {
            console.error(`Error al limpiar el valor del localStorage para la clave ${localStorageKey}:`, error);
        }
    };

    return {
        storedValue,
        setValue: saveValue,
        clearValue
    };
};
