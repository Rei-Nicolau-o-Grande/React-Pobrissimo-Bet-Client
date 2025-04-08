import {useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";
import axiosInstance from "../../../../helper/axios-instance.js";
import {useForm} from "react-hook-form";
import {maskMoneyDisplay, unmaskMoney} from "../../../../helper/mask.js";
import {useWallet} from "../../../../helper/WalletContext.jsx";

const symbols = ["🍒", "🍋", "🔔", "💎", "🍀", "🫏", "💩", "🐒", "🥩", "🖕", "❤️"];

const SYMBOL_HEIGHT = 80;
const REEL_COUNT = 5;
const SYMBOLS_PER_REEL = 3;
const CANVAS_WIDTH = REEL_COUNT * 100;
const CANVAS_HEIGHT = SYMBOL_HEIGHT * SYMBOLS_PER_REEL;

export function GameBurrinho() {
    const canvasRef = useRef(null);
    const animationRefs = useRef([]);
    const reelOffsets = useRef(Array(REEL_COUNT).fill(0));
    const [finalSymbols, setFinalSymbols] = useState(Array(REEL_COUNT).fill(Array(SYMBOLS_PER_REEL).fill('?')));
    const [spinning, setSpinning] = useState(false);
    const [multiplier, setMultiplier] = useState('');
    const [win, setWin] = useState(null);
    const [balance, setBalance] = useState(0);
    const [apiError, setApiError] = useState();

    const [cookies] = useCookies(["accessToken"]);
    const { walletData, fetchWalletData } = useWallet();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm();

    const value = watch("value");

    useEffect(() => {
        setValue("value", maskMoneyDisplay(value));
    }, [value]);

    useEffect(() => {
        drawInitialSymbols();
    }, [finalSymbols]);

    const drawInitialSymbols = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        for (let reel = 0; reel < REEL_COUNT; reel++) {
            for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
                drawSymbol(ctx, finalSymbols[reel][i], reel, i * SYMBOL_HEIGHT);
            }
        }
    };

    const drawSymbol = (ctx, symbol, reelIndex, y) => {
        ctx.font = "45px 'Segoe UI Emoji'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbol, reelIndex * 100 + 50, y + SYMBOL_HEIGHT / 2);
    };

    const animateReel = (reelIndex, duration, finalSymbols) => {
        const start = performance.now();
        const ctx = canvasRef.current.getContext("2d");

        const spin = (time) => {
            const elapsed = time - start;

            // offsetY usado para dar scroll visual
            const offsetY = (elapsed * 0.5) % SYMBOL_HEIGHT;

            ctx.clearRect(reelIndex * 100, 0, 100, CANVAS_HEIGHT);
            for (let i = 0; i < SYMBOLS_PER_REEL + 1; i++) {
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                drawSymbol(ctx, symbol, reelIndex, i * SYMBOL_HEIGHT - offsetY);
            }

            if (elapsed < duration) {
                animationRefs.current[reelIndex] = requestAnimationFrame(spin);
            } else {
                // desenha os símbolos finais
                ctx.clearRect(reelIndex * 100, 0, 100, CANVAS_HEIGHT);
                for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
                    drawSymbol(ctx, finalSymbols[reelIndex][i], reelIndex, i * SYMBOL_HEIGHT);
                }
                if (reelIndex === REEL_COUNT - 1) {
                    setSpinning(false);
                    fetchWalletData();
                }
            }
        };

        animationRefs.current[reelIndex] = requestAnimationFrame(spin);
    };

    const spinReels = async (formAmountBet) => {
        setSpinning(true);
        setWin(null);

        const formattedData = {
            ...formAmountBet,
            value: unmaskMoney(formAmountBet.value)
        };

        try {
            const response = await axiosInstance.post("/game/burrinho-fortune", formattedData, {
                headers: {
                    Authorization: `Bearer ${cookies.accessToken}`
                }
            });

            const reelsFromBackend = response.data.reels;
            setMultiplier(response.data.multiplier);
            setBalance(response.data.balance);
            setWin(response.data.win);
            setApiError(null);
            setFinalSymbols(reelsFromBackend);

            for (let i = 0; i < REEL_COUNT; i++) {
                animateReel(i, 2000 + i * 500, reelsFromBackend);
            }

        } catch (error) {
            setSpinning(false);
            setApiError(error.response?.data?.errorFields?.value?.join(', ') || error.response?.data?.message);
        }
    };

    return (
        <div className="grid grid-cols-12">
            <section className="col-span-12 py-3 px-3">
                <div className="text-center">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="border-4 border-gray-800 rounded-lg shadow-xl mx-auto mb-6 "
                    />

                    {!spinning && win !== null && (
                        <div className="mt-6">
                            <p className={`text-2xl font-bold ${win ? "text-green-600" : "text-red-600"} animate-bounce`}>
                                {win ? `🎉 Você ganhou x${multiplier}!` : "💸 Perdeu faz o L"}
                            </p>
                            <p className="mt-2 text-lg text-black">
                                Seu saldo: R$ {balance?.toFixed(2)}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(spinReels)}
                        className="flex flex-col items-center gap-4 mt-4"
                    >
                        <input
                            type="text"
                            placeholder="💰 Sua aposta"
                            autoComplete="off"
                            className="bg-amber-100 text-black text-center text-xl font-mono tracking-wide px-6 py-3 rounded-lg border border-gray-500 w-64 placeholder-black"
                            value={maskMoneyDisplay(value)}
                            {...register("value", {
                                onChange: (e) => setValue("value", maskMoneyDisplay(e.target.value))
                            })}
                        />

                        {/* Erro de validação do campo "value" */}
                        {errors?.value && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.value.message || (apiError?.errorFields?.value?.join(', ') || '')}
                            </p>
                        )}

                        {/* Erro geral da API */}
                        {apiError && !errors?.value && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-sm">
                                {apiError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={spinning}
                            className={`bg-gradient-to-r from-green-400 to-green-600 text-white text-xl font-bold px-10 py-3 rounded-xl shadow-md transform transition-transform duration-200 hover:scale-105 active:scale-95 ${
                                spinning ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {spinning ? "🎰 Girando..." : "🎯 Apostar"}
                        </button>
                    </form>

                </div>
            </section>
        </div>
    );
}
