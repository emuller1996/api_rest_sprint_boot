import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
  ModalFooter
} from 'flowbite-react';
import { HiPlus, HiTrash, HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useFacturas } from '../../../hooks/useFacturas';
import { FacturaItem, FacturaCreateRequest } from '../../types/facturas.types';
import { useProducts } from '../../../productos/hooks/useProducts';
import { Product } from '../../../productos/types/product.types';

interface FormInputs {
  clienteId: string;
  fecha: string;
}

const CreateFacturaView: React.FC = () => {
  const navigate = useNavigate();
  const { clientes, createFactura, fetchClientes } = useFacturas();
  const { products, changeName } = useProducts();
  
  const [items, setItems] = useState<FacturaItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
    }
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
    setSearchTerm('');
  };

  const removeProduct = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
  };

  const onSubmit = async (data: FormInputs) => {
    if (items.length === 0) {
      toast.error("Debe agregar al menos un producto a la factura");
      return;
    }

    const request: FacturaCreateRequest = {
      clienteId: parseInt(data.clienteId),
      fecha: data.fecha,
      detalles: items,
    };

    const result = await createFactura(request);
    if (result.success) {
      toast.success(result.message);
      navigate('/facturas');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button color="gray" onClick={() => navigate(-1)}>
            <HiArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Nueva Factura</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="clienteId">Cliente</Label>
                <Select 
                  {...register('clienteId', { required: "El cliente es obligatorio" })}
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </Select>
                {errors.clienteId && <span className="text-red-500 text-sm">{errors.clienteId.message}</span>}
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fecha">Fecha</Label>
                <TextInput 
                  type="date" 
                  {...register('fecha')} 
                />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
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
                    <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                      No hay productos agregados
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.nombreProducto}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>${item.precio.toFixed(2)}</TableCell>
                      <TableCell>${(item.cantidad * item.precio).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button color="failure" size="xs" onClick={() => removeProduct(index)}>
                          <HiTrash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-4">
            <div className="text-right">
              <p className="text-gray-600">Total General:</p>
              <p className="text-3xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button color="gray" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit" color="primary">Guardar Factura</Button>
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
            
            <div className="max-h-60 overflow-y-auto border rounded-md">
              {products.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => {
                    setSelectedProduct(p);
                    setItemPrice(p.precio);
                  }}
                  className={`p-2 cursor-pointer hover:bg-blue-50 transition-colors ${selectedProduct?.id === p.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                >
                  <p className="font-medium">{p.nombre}</p>
                  <p className="text-sm text-gray-500">${p.precio}</p>
                </div>
              ))}
              {products.length === 0 && <p className="p-4 text-center text-gray-500">No se encontraron productos</p>}
            </div>

            {selectedProduct && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
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
                        onChange={(e) => setItemPrice(parseFloat(e.target.value) || 0)} 
                      />
                    </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
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
