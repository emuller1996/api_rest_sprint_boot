import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Label,
  TextInput,
  Select,
  Modal,
  Table,
  Card,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
  TableBody,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Radio,
} from "flowbite-react";
import AsyncSelect from "react-select/async";
import { HiPlus, HiTrash, HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useFacturas } from "../../../hooks/useFacturas";
import { FacturaItem, FacturaCreateRequest } from "../../types/facturas.types";
import { useProducts } from "../../../productos/hooks/useProducts";
import { Product } from "../../../productos/types/product.types";

interface FormInputs {
  clienteId: string;
  estado: string;
}

const CreateFacturaView: React.FC = () => {
  const navigate = useNavigate();
  const { clientes, createFactura, fetchClientes } = useFacturas();
  const { products, changeName } = useProducts();

  const [items, setItems] = useState<FacturaItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      estado: "PENDIENTE",
    },
  });

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    if (itemQty <= 0 || itemPrice <= 0) {
      toast.error("La cantidad y el precio deben ser mayores a 0");
      return;
    }

    const newItem: FacturaItem = {
      productoId: selectedProduct.id,
      nombreProducto: selectedProduct.nombre,
      cantidad: itemQty,
      precio: itemPrice,
    };

    setItems([...items, newItem]);
    setSelectedProduct(null);
    setItemQty(1);
    setItemPrice(0);
    setIsModalOpen(false);
    setSearchTerm("");
  };

  const removeProduct = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
  };

  const onSubmit = async (data: FormInputs) => {
    if (items.length === 0) {
      toast.error("Debe agregar al menos un producto a la factura");
      return;
    }

    const request: FacturaCreateRequest = {
      clienteId: parseInt(data.clienteId),
      estado: data.estado,
      detalles: items,
    };

    const result = await createFactura(request);
    if (result.success) {
      toast.success(result.message);
      navigate("/facturas");
    } else {
      toast.error(result.message);
    }
  };

  const loadOptions = async (inputValue: string) => {
    return clientes
      .filter((c) => c.nombre.toLowerCase().includes(inputValue.toLowerCase()))
      .map((c) => ({
        value: c.id.toString(),
        label: c.nombre,
      }));
  };

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "white",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      borderRadius: "0.5rem",
      padding: "0px 4px",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9ca3af",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#374151",
    }),
  };

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button color="gray" onClick={() => navigate(-1)}>
            <HiArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Nueva Factura</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="clienteId">Cliente</Label>
              <Controller
                name="clienteId"
                control={control}
                rules={{ required: "El cliente es obligatorio" }}
                render={({ field }) => (
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptions}
                    styles={selectStyles}
                    placeholder="Seleccione un cliente"
                    value={
                      clientes.find((c) => c.id.toString() === field.value)
                        ? {
                            value: field.value,
                            label: clientes.find(
                              (c) => c.id.toString() === field.value,
                            )?.nombre,
                          }
                        : null
                    }
                    onChange={(val: any) =>
                      field.onChange(val ? val.value : "")
                    }
                    isClearable
                  />
                )}
              />
              {errors.clienteId && (
                <span className="text-sm text-red-500">
                  {errors.clienteId.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="">Estado de Factura</Label>
              <div className="mt-2 flex max-w-md flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Radio
                    id="pendiente"
                    value="PENDIENTE"
                    defaultChecked
                    {...register("estado")}
                  />
                  <Label htmlFor="pendiente">PENDIENTE</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio
                    id="pagada"
                    {...register("estado")}
                    value="PAGADA"
                  />
                  <Label htmlFor="pagada">PAGADA</Label>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Productos</h2>
            <Button color="info" onClick={() => setIsModalOpen(true)}>
              <HiPlus className="mr-2" /> Agregar Producto
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableHeadCell>Producto</TableHeadCell>
                <TableHeadCell>Cantidad</TableHeadCell>
                <TableHeadCell>Precio Unit.</TableHeadCell>
                <TableHeadCell>Subtotal</TableHeadCell>
                <TableHeadCell>Acciones</TableHeadCell>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-4 text-center text-gray-500"
                    >
                      No hay productos agregados
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.nombreProducto}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>${item.precio.toFixed(2)}</TableCell>
                      <TableCell>
                        ${(item.cantidad * item.precio).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => removeProduct(index)}
                        >
                          <HiTrash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="text-right">
              <p className="text-gray-600">Total General:</p>
              <p className="text-3xl font-bold text-blue-600">
                ${calculateTotal().toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button color="gray" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" color="primary">
            Guardar Factura
          </Button>
        </div>
      </form>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>Seleccionar Producto</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <TextInput
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                changeName(e.target.value);
              }}
            />

            <div className="max-h-60 overflow-y-auto rounded-md border">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setItemPrice(p.precio);
                  }}
                  className={`cursor-pointer p-2 transition-colors hover:bg-blue-50 ${selectedProduct?.id === p.id ? "border-l-4 border-blue-500 bg-blue-100" : ""}`}
                >
                  <p className="font-medium">{p.nombre}</p>
                  <p className="text-sm text-gray-500">${p.precio}</p>
                </div>
              ))}
              {products.length === 0 && (
                <p className="p-4 text-center text-gray-500">
                  No se encontraron productos
                </p>
              )}
            </div>

            {selectedProduct && (
              <div className="grid grid-cols-2 gap-4 rounded-lg border bg-gray-50 p-4">
                <div>
                  <Label>Cantidad</Label>
                  <TextInput
                    type="number"
                    value={itemQty}
                    onChange={(e) => setItemQty(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Precio</Label>
                  <TextInput
                    type="number"
                    value={itemPrice}
                    onChange={(e) =>
                      setItemPrice(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            color="primary"
            disabled={!selectedProduct}
            onClick={handleAddProduct}
          >
            Agregar a Factura
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CreateFacturaView;
