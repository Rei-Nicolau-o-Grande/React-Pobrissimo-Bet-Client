import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { useWallet } from "../../../../helper/WalletContext.jsx";
import { maskMoneyDisplay, unmaskMoney } from "../../../../helper/mask.js";
import axiosInstance from "../../../../helper/axios-instance.js";
import { TextInput } from "flowbite-react";
import "./GameRodaRodaRoletaPicanha.css";

export function GameRoletaPicanha() {
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
    const [spinning, setSpinning] = useState(false);
    const [multiplier, setMultiplier] = useState('');
    const [win, setWin] = useState(null);
    const [apiError, setApiError] = useState();
    const [cookies] = useCookies(["accessToken"]);
    const [wheel, setWheel] = useState(Array(11).fill("?"));
    const [resultado, setResultado] = useState(null);
    const [rotationAngle, setRotationAngle] = useState(0);
    const rotationAngleRef = useRef(0);
    const [balance, setBalance] = useState(0);

    const canvasRef = useRef(null);
    const requestAnimationRef = useRef(null);
    const { walletData, fetchWalletData } = useWallet();
    const value = watch("value");

    useEffect(() => {
        setValue("value", maskMoneyDisplay(value));
    }, [value, setValue]);

    const drawWheel = (wheelData = wheel) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const numSegments = wheelData.length;
        const segmentAngle = (2 * Math.PI) / numSegments;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        wheelData.forEach((item, index) => {
            const startAngle = rotationAngleRef.current + index * segmentAngle;
            const endAngle = startAngle + segmentAngle;

            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, endAngle);
            ctx.fillStyle = index % 2 === 0 ? "#f9c74f" : "#90be6d";
            ctx.fill();
            ctx.stroke();

            // texto (emoji)
            const angle = startAngle + segmentAngle / 2;
            const x = canvas.width / 2 + Math.cos(angle) * canvas.width / 3;
            const y = canvas.height / 2 + Math.sin(angle) * canvas.height / 3;
            ctx.font = "28px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#000";
            ctx.fillText(item, x, y);
        });
    };



    useEffect(() => {
        drawWheel();
    }, [wheel, rotationAngle]);

    const spinWheel = async (formAmountBet) => {
        if (spinning) return;
        if (requestAnimationRef.current) cancelAnimationFrame(requestAnimationRef.current);

        setSpinning(true);
        setResultado(null);

        const formattedData = {
            ...formAmountBet,
            value: unmaskMoney(formAmountBet.value),
        };

        try {
            const response = await axiosInstance.post("/game/roda-roda-picanha", formattedData, {
                headers: { Authorization: `Bearer ${cookies.accessToken}` }
            });

            const { wheel: wheelFromAPI, win: jogadorGanhou, multiplier, balance: saldo } = response.data;
            setWheel(wheelFromAPI);
            setWin(jogadorGanhou);
            setMultiplier(multiplier);
            setBalance(saldo)
            setApiError(null);

            await new Promise(resolve => setTimeout(resolve, 10)); // garante atualização

            const numSegments = wheelFromAPI.length;
            const segmentAngle = (2 * Math.PI) / numSegments;
            const markerAngle = 3 * Math.PI / 2; // topo
            const targetIndex = 5; // fixo para exemplo
            let targetAngle = markerAngle - (targetIndex * segmentAngle) - (segmentAngle / 2);
            if (targetAngle < 0) targetAngle += 2 * Math.PI;

            const fullSpins = 6;
            const currentRotation = rotationAngle % (2 * Math.PI);
            const totalRotation = fullSpins * 2 * Math.PI + targetAngle - currentRotation;

            const duration = 5000;
            const startTime = performance.now();
            const startAngle = rotationAngleRef.current;

            const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutCubic(progress);
                const newAngle = startAngle + totalRotation * eased;

                rotationAngleRef.current = newAngle;
                drawWheel(wheelFromAPI); // 👈 aqui!

                if (progress < 1) {
                    requestAnimationRef.current = requestAnimationFrame(animate);
                } else {
                    setRotationAngle(rotationAngleRef.current);
                    setResultado({ win: jogadorGanhou, balance });
                    fetchWalletData();
                    setSpinning(false);
                }
            };

            requestAnimationRef.current = requestAnimationFrame(animate);

        } catch (error) {
            setSpinning(false);

            const apiMessage = error.response?.data?.errorFields?.value?.join(', ') ||
                error.response?.data?.message;

            setApiError(apiMessage);
        }
    };

    const renderMarker = () => (
        <div className="wheel-marker">
            <div className="marker-triangle"></div>
        </div>
    );

    return (
        <div className="grid grid-cols-12">
            <section className="col-span-12 py-3 px-3">
                <div className="roleta-container">

                    <div className="roleta-wrapper">
                        {renderMarker()}
                        <canvas ref={canvasRef} width={300} height={300} className="roleta-canvas" />
                    </div>

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

                    <form onSubmit={handleSubmit(spinWheel)}
                          className="flex flex-col items-center gap-4 mt-4"
                    >
                        <input
                            id="bet"
                            type="text"
                            placeholder="💰 Sua aposta"
                            autoComplete="off"
                            className="bg-amber-100 text-black text-center text-xl font-mono tracking-wide px-6 py-3 rounded-lg border border-gray-500 w-64 placeholder-black"
                            {...register("value", {
                                onChange: (e) => setValue('value', maskMoneyDisplay(e.target.value)),
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
