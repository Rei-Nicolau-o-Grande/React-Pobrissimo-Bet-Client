import {useEffect, useState} from "react";
import {TextInput} from "flowbite-react";
import './GameBurrinhoStyles.css';
import {useCookies} from "react-cookie";
import axiosInstance from "../../../../helper/axios-instance.js";
import {useForm} from "react-hook-form";
import {maskMoneyDisplay, unmaskMoney} from "../../../../helper/mask.js";
import {useWallet} from "../../../../helper/WalletContext.jsx";

const symbols = ["🍒", "🍋", "🔔", "💎", "🍀", "🫏", "💩", "🐒", "🥩", "🍺", "🚀", "🗿", "🖕"];

export function GameBurrinho() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm();
    const [reels, setReels] = useState(Array(5).fill(Array(3).fill('?')));
    const [bet, setBet] = useState('');
    const [win, setWin] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [apiError, setApiError] = useState(true);
    const [cookies] = useCookies(["accessToken"]);

    const { walletData, fetchWalletData } = useWallet();

    const spinReels = async (formAmountBet) => {
        setSpinning(true);
        setApiError(true);

        const formattedData = {
            ...formAmountBet,
            value: unmaskMoney(formAmountBet.value)
        };

        try {
            const response = await axiosInstance.post("/game/burrinho", formattedData, {
                headers: {
                    Authorization: `Bearer ${cookies.accessToken}`
                }
            });

            setBet(response.data.bet);

            if (response.data && Array.isArray(response.data.reels)) {
                const finalSymbols = response.data.reels;

                reels.forEach((_, index) => {
                    let spinSpeed = 100;
                    const spinDuration = 2000 + index * 500; // Aumenta o tempo para cada rolo
                    const spinInterval = setInterval(() => {
                        // Simula a rotação visual mudando os símbolos temporários
                        setReels((prevReels) =>
                            prevReels.map((col, colIndex) =>
                                colIndex === index
                                    ? Array.from({ length: 3 }, () =>
                                        symbols[Math.floor(Math.random() * symbols.length)]
                                    )
                                    : col
                            )
                        );

                        // Aumenta a velocidade para desacelerar
                        spinSpeed += 50;
                        if (spinSpeed > 400) spinSpeed = 400;
                    }, spinSpeed);

                    setTimeout(() => {
                        clearInterval(spinInterval);
                        // Mostra os símbolos finais do backend
                        setReels((prevReels) =>
                            prevReels.map((col, colIndex) =>
                                colIndex === index ? finalSymbols[index] : col
                            )
                        );

                        // if (index === reels.length - 1) setSpinning(false);
                        if (index === reels.length - 1) {
                            setSpinning(false);
                            setWin(response.data.win);
                            fetchWalletData();  // Atualiza o saldo após a rotação final dos rolos
                        }
                    }, spinDuration);

                });
            } else {
                console.error("Formato inesperado dos dados recebidos:", response.data);
            }
        } catch (error) {
            console.error("Erro ao girar os rolos:", error);
            setSpinning(false);
            setWin(false);
            setApiError(error.response?.data.errorFields.value);
        }
    };

    const checkWin = () => {
        for (let col = 0; col < 5; col++) {
            if (reels.every((row) => row[col] === reels[0][col])) {
                return true;
            }
        }
        return false;
    };

    const value = watch("value");

    useEffect(() => {
        setValue("value", maskMoneyDisplay(value));
    }, [value]);

    return (
        <div className="grid grid-cols-12">
            <section className="col-span-12 py-3 px-3">
                <div className="slot-machine">
                    <div className="reels">
                        {reels.map((column, colIndex) => (
                            <div key={colIndex} className="reel">
                                <div className="symbol-container">
                                    {column.map((symbol, symbolIndex) => (
                                        <div key={symbolIndex} className="symbol">
                                            {symbol}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit(spinReels)}>

                        <label htmlFor="amoutBet">Aposta:</label>
                        <TextInput
                            id="bet"
                            type="text"
                            autoComplete="off"
                            placeholder="0.00"
                            value={maskMoneyDisplay(value)}
                            {...register("value", {
                                required: "Campo obrigatório",
                                onChange: (e) => setValue('value', maskMoneyDisplay(e.target.value)),
                            })}
                            color={`${errors?.value || apiError?.errorFields?.value ? 'failure' : ''}`}

                            helperText={
                                errors?.value?.message ??
                                (apiError?.errorFields?.value?.length > 0 ?
                                        apiError.errorFields.value.join(', ') :
                                        ''
                                )
                            }
                        />
                        <button
                            type={"submit"}
                            className="bg-green-500 py-3 px-3 text-white mt-4 rounded"
                            disabled={spinning}
                        >
                            {spinning ? 'Girando...' : 'Gire'}
                        </button>
                    </form>
                    {{ apiError } && (
                        <div className="error">
                            {apiError}
                        </div>
                    )}
                    <div className="result">
                        {!spinning && win !== null && (win ? `Você ganhou x${bet}!` : 'Perdeu faz o 🇱')}
                    </div>
                </div>
            </section>
        </div>
    );
}
