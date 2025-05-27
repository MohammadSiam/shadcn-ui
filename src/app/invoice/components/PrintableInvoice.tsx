import { forwardRef } from "react";

// Define product type
type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
};

type PrintableInvoiceProps = {
  formValues: {
    invoiceNumber: string;
    date: string;
    customerName: string;
    customerEmail: string;
    overallDiscount: number;
  };
  products: Product[];
  calculateSubtotal: (product: Product) => number;
  calculateTotal: () => number;
};

const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ formValues, products, calculateSubtotal, calculateTotal }, ref) => {
    return (
      <div ref={ref} className="p-6 bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-gray-500">#{formValues.invoiceNumber}</p>
            <p className="text-gray-500">{formValues.date}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold">Your Company Name</h3>
            <p>123 Business Street</p>
            <p>City, State ZIP</p>
            <p>contact@yourcompany.com</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8">
          <h3 className="font-bold mb-2">Bill To:</h3>
          <p>{formValues.customerName || "Customer Name"}</p>
          <p>{formValues.customerEmail || "customer@example.com"}</p>
        </div>

        {/* Products Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Discount</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="py-2">{product.name || "Product"}</td>
                <td className="text-right py-2">${product.price.toFixed(2)}</td>
                <td className="text-right py-2">{product.quantity}</td>
                <td className="text-right py-2">{product.discount}%</td>
                <td className="text-right py-2">
                  ${calculateSubtotal(product).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>
                $
                {products
                  .reduce((sum, product) => sum + calculateSubtotal(product), 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount:</span>
              <span>{formValues.overallDiscount}%</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t text-center text-gray-500">
          <p>Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

PrintableInvoice.displayName = "PrintableInvoice";

export default PrintableInvoice;
