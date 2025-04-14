import useSWR, { useSWRConfig } from "swr";
import { deleteProduct, getAllProduct } from "../services/ProductService.jsx";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Home = () => {
  const { mutate } = useSWRConfig();

  const fetcher = async (url) => {
    return await getAllProduct(url);
  };

  const { data, error, isLoading } = useSWR("/api/products", fetcher);

  const delProduct = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Confirmation",
      text: "Are you sure you want to delete this product?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    });

    if (confirm.isConfirmed) {
      try {
        await deleteProduct(id);
        mutate("/api/products");
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete the product.", "error");
      }
    }
  };

  return (
    <div className="flex flex-col mt-5 px-4">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Product List</h1>
          <Link
            to="/add"
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
          >
            + Add New
          </Link>
        </div>

        <div className="relative shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-2 text-center">No</th>
                <th className="py-3 px-2">Product Name</th>
                <th className="py-3 px-2 text-right">QTY</th>
                <th className="py-3 px-2 text-right">Price</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-red-500">
                    Failed to load data
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((product, index) => (
                  <tr key={product.id} className="bg-white border-b">
                    <td className="py-3 px-2 text-center">{index + 1}</td>
                    <td className="py-3 px-2">{product.name}</td>
                    <td className="py-3 px-2 text-right">{product.qty}</td>
                    <td className="py-3 px-2 text-right">{product.price}</td>
                    <td className="py-3 px-2 text-center">
                      <Link
                        to={`/edit/${product.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-1"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => delProduct(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    No Products Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
