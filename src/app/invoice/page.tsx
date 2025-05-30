"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Printer } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PrintableInvoice from "./components/PrintableInvoice";

// Define product type
type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
};

// Invoice schema
const invoiceSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),
  overallDiscount: z.coerce.number().min(0).max(100),
});

export default function InvoicePage() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "", price: 0, quantity: 1, discount: 0 },
  ]);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      invoiceNumber: `INV-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}`,
      date: new Date().toISOString().split("T")[0],
      overallDiscount: 0,
    },
  });

  // Calculate subtotal for a product
  const calculateSubtotal = (product: Product) => {
    const subtotal = product.price * product.quantity;
    const discountAmount = subtotal * (product.discount / 100);
    return subtotal - discountAmount;
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = products.reduce(
      (sum, product) => sum + calculateSubtotal(product),
      0
    );
    const overallDiscount = subtotal * (form.getValues().overallDiscount / 100);
    return subtotal - overallDiscount;
  };

  // Simple print function using browser's native print
  const printInvoice = () => {
    if (!invoiceRef.current) {
      console.error("Invoice reference is not available");
      return;
    }

    // Add print-specific styles
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #invoice-container, #invoice-container * {
          visibility: visible;
        }
        #invoice-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    // Add an ID to the invoice container for targeting in CSS
    const originalId = invoiceRef.current.id;
    invoiceRef.current.id = "invoice-container";

    // Print
    window.print();

    // Clean up
    document.head.removeChild(style);
    invoiceRef.current.id = originalId;
  };

  // Add new product row
  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        name: "",
        price: 0,
        quantity: 1,
        discount: 0,
      },
    ]);
  };

  // Remove product row
  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  // Update product
  const updateProduct = (
    id: string,
    field: keyof Product,
    value: string | number
  ) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof invoiceSchema>) => {
    console.log("Form submitted:", data);
    console.log("Products:", products);
    // Here you could save the invoice or process it further
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoice Generator</h1>
        <Button onClick={printInvoice} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="invoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Invoice Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Email</FormLabel>
                        <FormControl>
                          <Input placeholder="customer email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overallDiscount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-12 gap-2 items-end"
                  >
                    <div className="col-span-4">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Product
                      </label>
                      <Input
                        value={product.name}
                        onChange={(e) =>
                          updateProduct(product.id, "name", e.target.value)
                        }
                        placeholder="Product name"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Price
                      </label>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) =>
                          updateProduct(
                            product.id,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Qty
                      </label>
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          updateProduct(
                            product.id,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Discount %
                      </label>
                      <Input
                        type="number"
                        value={product.discount}
                        onChange={(e) =>
                          updateProduct(
                            product.id,
                            "discount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeProduct(product.id)}
                        disabled={products.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addProduct}
                  className="w-full mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <PrintableInvoice
                ref={invoiceRef}
                formValues={{
                  invoiceNumber: form.getValues().invoiceNumber,
                  date: form.getValues().date,
                  customerName: form.getValues().customerName,
                  customerEmail: form.getValues().customerEmail,
                  overallDiscount: form.getValues().overallDiscount,
                }}
                products={products}
                calculateSubtotal={calculateSubtotal}
                calculateTotal={calculateTotal}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
