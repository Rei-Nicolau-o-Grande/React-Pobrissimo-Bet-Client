// Função para formatar valor monetário em reais
const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

// Função para formatar data
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export function TableComponent({ data = [], columns }) {
    const safeData = Array.isArray(data) ? data : [];

    const columnKeys = columns
        ? columns
        : safeData.length > 0
            ? Object.keys(safeData[0]).map((key) => ({
                key,
                label: key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase()),
            }))
            : [];

    if (safeData.length === 0) {
        return <div className="text-center py-4 text-gray-600">Nenhum dado disponível</div>;
    }

    return (
        <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                <thead>
                <tr className="bg-gray-100">
                    {columnKeys.map((col) => (
                        <th
                            key={col.key}
                            className="text-center font-semibold text-gray-700 px-2 py-2 sm:px-4 sm:py-3 border border-gray-200 min-w-[120px]"
                        >
                            {col.label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {safeData.map((row, index) => (
                    <tr
                        key={row.id || index}
                        className="bg-white hover:bg-gray-50 transition-colors border-t border-gray-200"
                    >
                        {columnKeys.map((col) => (
                            <td
                                key={col.key}
                                className={`text-center px-2 py-2 sm:px-4 sm:py-3 border border-gray-200 min-w-[120px] ${
                                    col.key === "nameGame" ? "font-medium text-gray-900" : ""
                                } ${
                                    col.key === "resultBet"
                                        ? row[col.key] === "WINNER"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        : ""
                                }`}
                            >
                                {col.key === "amount" && row[col.key] != null
                                    ? formatCurrency(row[col.key])
                                    // : col.key === "createdAt" && row[col.key]
                                    //     ? formatDate(row[col.key])
                                        : col.key === "multiplier" && (row[col.key] === null || row[col.key] === undefined)
                                            ? "-"
                                            : row[col.key] || "-"}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}