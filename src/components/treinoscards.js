export default function TreinoCard({ nome, series, repeticoes, observacao }) {
  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-800">
      <h2 className="text-lg font-bold text-white tracking-wide">{nome}</h2>

      <p className="text-gray-400 text-sm mt-1">
        {series} séries · {repeticoes} repetições
      </p>

      {observacao && (
        <p className="text-gray-500 text-xs mt-2 italic">
          {observacao}
        </p>
      )}
    </div>
  );
}