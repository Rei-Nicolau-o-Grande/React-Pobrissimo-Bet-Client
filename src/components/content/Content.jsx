function Content() {
    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-lg max-w-2xl mx-auto my-8">
            <h1 className="text-center text-3xl font-bold text-yellow-700 mb-4 animate-pulse">
                ⚠️ ATENÇÃO! ⚠️
            </h1>
            <div className="text-center text-lg text-yellow-800 bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <p className="mb-3 font-semibold">
                    Este projeto é apenas uma MEME!
                </p>
                <p className="mb-3">
                    <span className="inline-block bg-yellow-200 px-2 py-1 rounded font-bold">
                        NÃO envolve dinheiro real!
                    </span>
                </p>
                <p className="text-base italic">
                    Quer ganhar dinheiro de verdade? Recomendo procurar um <span className="font-bold underline">trabalho</span>!
                    🐒
                </p>
            </div>
        </div>
    );
}

export default Content;