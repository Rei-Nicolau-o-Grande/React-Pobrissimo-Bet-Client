import {TableComponent} from "../../../../components/table/table.jsx";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import axiosInstance from "../../../../helper/axios-instance.js";

export function TableResultGameRodaRodaPicanha() {
    const [data, setData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cookies] = useCookies(["accessToken"]);

    const getTickets = async () => {
        try {
            const response = await axiosInstance.get("/ticket/roda-roda-picanha", {
                headers: {
                    Authorization: `Bearer ${cookies.accessToken}`,
                },
            });

            setData(response.data);
            setColumns([
                { key: "amount", label: "Valor" },
                { key: "multiplier", label: "Multiplicador" },
                { key: "resultBet", label: "Resultado" },
                { key: "createdAt", label: "Data" },
            ]);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar tickets:", error);
            setError("Não foi possível carregar os dados. Tente novamente.");
            setData([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        getTickets();
    }, []);

    if (loading) {
        return <div className="text-center py-4">Carregando...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-600">{error}</div>;
    }


    return (
        <TableComponent data={data} columns={columns} />
    );
}