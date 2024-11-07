import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import groceries from "./components/products";

function App() {
  const [carrito, setCarrito] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState(
    new Set()
  );

  const agregarAlCarrito = (item) => {
    setCarrito((prev) => ({
      ...prev,
      [item.id]: {
        ...item,
        cantidad: (prev[item.id]?.cantidad || 0) + 1,
      },
    }));
    setProductosSeleccionados((prev) => new Set(prev).add(item.id)); // Marca el producto como seleccionado
  };

  const eliminarUno = (id) => {
    setCarrito((prev) => {
      const newCantidad = prev[id].cantidad - 1;
      if (newCantidad <= 0) {
        const { [id]: _, ...rest } = prev;
        setProductosSeleccionados((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id); // Desmarca el producto si ya no está en el carrito
          return newSet;
        });
        return rest;
      }
      return {
        ...prev,
        [id]: {
          ...prev[id],
          cantidad: newCantidad,
        },
      };
    });
  };

  const eliminarTodo = () => {
    setCarrito({});
    setProductosSeleccionados(new Set()); // Limpia todos los productos seleccionados
  };

  const calcularTotal = () => {
    return Object.values(carrito)
      .reduce((total, item) => total + item.unitPrice * item.cantidad, 0)
      .toFixed(2);
  };

  const categorias = [...new Set(groceries.map((item) => item.category))];

  return (
    <div className="container">
      <header className="header">
        <h1>Disco</h1>
      </header>

      <div className="column">
        <h2>Productos disponibles</h2>
        <div>
          {categorias.map((categoria) => (
            <div key={categoria}>
              <button
                onClick={() =>
                  setCategoriaSeleccionada(
                    categoriaSeleccionada === categoria ? null : categoria
                  )
                }
                className="categoryButton"
              >
                {categoriaSeleccionada === categoria
                  ? ` ${categoria}`
                  : categoria}
              </button>
              {categoriaSeleccionada === categoria && (
                <div className="productsContainer">
                  {groceries
                    .filter((item) => item.category === categoria)
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => agregarAlCarrito(item)}
                        className="itemButton"
                      >
                        {productosSeleccionados.has(item.id) ? "✔️" : ""}{" "}
                        {item.name} - ${item.unitPrice.toFixed(2)}
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="column">
        <h2>Carrito de compras</h2>
        {Object.keys(carrito).length === 0 ? (
          <p>
            Por favor, seleccione uno o más productos para agregar al carrito.
          </p>
        ) : (
          <>
            <div>
              {Object.values(carrito).map((item) => (
                <button
                  key={item.id}
                  onClick={() => eliminarUno(item.id)}
                  className="itemButton"
                >
                  ❌ {item.name} - ${item.unitPrice.toFixed(2)} ∘ Cantidad:{" "}
                  {item.cantidad}
                </button>
              ))}
            </div>
            <div className="totalContainer">
              <button className="total">Total: ${calcularTotal()}</button>
              <button onClick={eliminarTodo} className="clearButton">
                Eliminar Todo
              </button>
            </div>
          </>
        )}
      </div>
      
    </div>
  );
}

export default App;
