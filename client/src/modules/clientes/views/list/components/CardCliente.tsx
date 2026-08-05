import { Cliente } from "../../../types/cliente.types";


interface CardClienteProps {
  cliente: Cliente;
}

export default function CardCliente(cliente:CardClienteProps) {


    return (<div
              key={cliente.cliente.id}
              className="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-lg font-bold text-white">
                    C{cliente.cliente.nombre.substring(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {cliente.cliente.nombre}
                    </h4>
                    <p className="text-sm text-gray-500">{cliente.cliente.direccion}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">#{cliente.cliente.id}</span>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-500">Telefono</span>
                <span className="font-medium text-orange-600">{cliente.cliente.telefono}</span>
              </div>
            </div>)
}