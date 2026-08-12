import { HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { useFacturas } from "../../../hooks/useFacturas";
import { formatPrice } from "../../../../utils";

export default function ListFacturas() {
  const { facturas } = useFacturas();
  return (
    <div>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Facturas</h2>
            <p className="mt-1 text-gray-500">
              Sección de ventas para ver y registrar las facturas de ventas.
            </p>
          </div>
          <Link 
            to="/facturas/nuevo" 
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
          >
            <HiPlus className="h-5 w-5" />
            <span>Nueva Factura</span>
          </Link>
        </div>
      </div>
      <div className="mt-2 rounded-xl bg-white p-4 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-semibold">NUM- FACTURA</th>
              <th className="pb-3 font-semibold">Cliente</th>
              <th className="pb-3 font-semibold">Estado</th>
              <th className="pb-3 text-right font-semibold">Total</th>
              <th className="pb-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((inv) => (
              <tr className="border-b transition-colors last:border-0 hover:bg-orange-50">
                <td className="py-3 font-mono text-sm">#{inv.numeroFactura}</td>
                <td className="py-3 font-medium text-gray-800">{inv.cliente.nombre} / {inv.cliente.telefono}</td>
                <td className="py-3">{inv.estado}</td>
              
                <td className="py-3 text-center">{formatPrice(inv.total)}</td>
                <td className="py-3 text-right">
                  <button
                    //onClick={() => handleEdit(product.id)}
                    className="mr-2 inline-flex items-center rounded-lg p-2 text-orange-600 transition-colors hover:bg-orange-50 hover:text-orange-700"
                    //disabled={loadingAction}
                  >
                    <HiPencil className="h-4 w-4" />
                  </button>
                  <button
                    //onClick={() => handleDelete(product.id)}
                    className="inline-flex items-center rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    //disabled={loadingAction}
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
