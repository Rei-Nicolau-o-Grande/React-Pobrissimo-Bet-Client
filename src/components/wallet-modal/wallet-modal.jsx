import {Modal} from "flowbite-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import Transaction from "../transaction/transaction.jsx";
import {useCookies} from "react-cookie";
import {useWallet} from "../../helper/WalletContext.jsx";

function WalletModal() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors},
        reset
    } = useForm();

    const [openModal, setOpenModal] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

    const { walletData, loading, apiError, fetchWalletData } = useWallet();

    return (
        <>
            <p onClick={() => setOpenModal(true)} color={"success"} className={"my-3"}>
                {loading && <span className={`text-white`}>Loading...</span>}
                {apiError && <span>{apiError}</span>}
                {!loading && !walletData && !apiError && (
                    <span
                        className="text-white hover:text-gray-500 my-3 w-full hover:cursor-pointer"
                    >
                        Caímos , voltamos já...
                    </span>
                )}
                {walletData && (
                    <span className={`text-white hover:text-gray-500 my-3 w-full hover:cursor-pointer`}>
                        {walletData.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                )}
            </p>

            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Saldo:
                    {loading && <div>Loading...</div>}
                    {!loading && !walletData && !apiError && (
                        <span
                            className="text-black"
                        >
                        Buscando o seu saldo, voltamos já...
                    </span>
                    )}
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