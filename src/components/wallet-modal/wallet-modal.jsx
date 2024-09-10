import {Modal} from "flowbite-react";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import Transaction from "../transaction/transaction.jsx";
import {useCookies} from "react-cookie";
import axiosInstance from "../../helper/axios-instance.js";

function WalletModal() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors},
        reset
    } = useForm();
    const [walletData, setWalletData] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

    const fetchWalletData = async () => {
        setLoading(true);
        if (cookies.accessToken) {
            await axiosInstance.get("/wallet/my-wallet", {
                headers: {
                    Authorization: `Bearer ${cookies.accessToken}`
                }
            })
                .then(
                    response => {
                        setLoading(false);
                        setWalletData(response.data);
                    }
                )
                .catch(
                    error => {
                        setLoading(false);
                        setApiError(error.response.data.message);
                    }
                );
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, [cookies.accessToken]);

    return (
        <>
            <p onClick={() => setOpenModal(true)} color={"success"} className={"my-3"}>
                {loading && <span>Loading...</span>}
                {apiError && <span>{apiError}</span>}
                {walletData && (
                    <span className={`text-white hover:text-gray-500 my-3 w-full hover:cursor-pointer`}>
                        {walletData.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                )}
            </p>

            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Saldo:
                    {loading && <div>Loading...</div>}
                    { walletData && (
                        <span>{walletData.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <Transaction
                        walletData={walletData}
                        setOpenModal={setOpenModal}
                        fetchWalletData={fetchWalletData}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default WalletModal;