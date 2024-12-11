// WalletContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axiosInstance from "./axios-instance.js";

// Criação do contexto
const WalletContext = createContext();

// eslint-disable-next-line react/prop-types
export const WalletProvider = ({ children }) => {
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [cookies] = useCookies(["accessToken"]);

    // Função para atualizar os dados da carteira
    const fetchWalletData = async () => {
        setLoading(true);
        if (cookies.accessToken) {
            try {
                const response = await axiosInstance.get("/wallet/my-wallet", {
                    headers: {
                        Authorization: `Bearer ${cookies.accessToken}`
                    }
                });
                setWalletData(response.data);
            } catch (error) {
                setApiError(error.response?.data?.message);
            } finally {
                setLoading(false);
            }
        }
    };

    // Chamada inicial para carregar os dados da carteira
    useEffect(() => {
        fetchWalletData();
    }, [cookies.accessToken]);

    return (
        <WalletContext.Provider value={{ walletData, loading, apiError, fetchWalletData }}>
            {children}
        </WalletContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => useContext(WalletContext);
