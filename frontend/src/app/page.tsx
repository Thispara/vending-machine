"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Banknote, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Product } from "@/types/type";
import { vendingService } from "@/service/vending/vending.service";

interface InsertedMoney {
  denomination: number;
  quantity: number;
}

function calculateTotalMoney(money: InsertedMoney[]): number {
  return money.reduce(
    (total, { denomination, quantity }) => total + denomination * quantity,
    0
  );
}

const denominations = [
  { value: 1, label: "1 ฿" },
  { value: 5, label: "5 ฿" },
  { value: 10, label: "10 ฿" },
  { value: 20, label: "20 ฿" },
  { value: 50, label: "50 ฿" },
  { value: 100, label: "100 ฿" },
  { value: 500, label: "500 ฿" },
  { value: 1000, label: "1000 ฿" },
];

export default function VendingMachinePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [insertedMoney, setInsertedMoney] = useState<InsertedMoney[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const totalMoney = calculateTotalMoney(insertedMoney);
  const coinDenominations = [1, 5, 10];
  const banknoteDenominations = [20, 50, 100, 500, 1000];

  function formatChange(change: Record<number, number>) {
    const entries = Object.entries(change);

    if (entries.length === 0) return "No change";

    return entries.map(([denom, qty]) => `${denom}฿ x${qty}`).join(", ");
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await vendingService.getProducts();
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const buyProduct = async (id: string) => {
    try {
      const response = await vendingService.buyProduct(id, insertedMoney);
      toast({
        title: "Product Bought",
        description: `
${response.product_name}
Paid: ${response.paid_amount} ฿
Change: ${response.change_amount} ฿
(${formatChange(response.change)})
      `,
      });

      completePurchase();
    } catch (error: any) {
      console.error("Error buying product:", error);
      toast({
        title: "Error",
        description: `${(error as any)?.response?.data?.detail}`,
        variant: "destructive",
      });
    }
  };

  const insertMoney = (amount: number) => {
    setInsertedMoney((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.denomination === amount
      );
      let updated;

      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
      } else {
        updated = [...prev, { denomination: amount, quantity: 1 }];
      }

      toast({
        title: "Money Inserted",
        description: `Added ${amount} ฿. Total: ${calculateTotalMoney(
          updated
        )} ฿`,
      });

      return updated;
    });
  };

  const selectProduct = (product: Product) => {
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently unavailable`,
        variant: "destructive",
      });
      return;
    }

    if (totalMoney < product.price) {
      toast({
        title: "Insufficient Funds",
        description: `Please insert ${product.price - totalMoney} ฿ more`,
        variant: "destructive",
      });
      return;
    }

    setSelectedProduct(product);
  };

  const completePurchase = () => {
    if (!selectedProduct) return;

    const change = totalMoney - selectedProduct.price;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id ? { ...p, stock: p.stock - 1 } : p
      )
    );

    setInsertedMoney([]);
    setSelectedProduct(null);
  };

  const cancelTransaction = () => {
    if (totalMoney > 0) {
      toast({
        title: "Transaction Cancelled",
        description: `Returned ${totalMoney} ฿`,
      });
    }

    setInsertedMoney([]);
    setSelectedProduct(null);
  };

  const canBuyProduct = (product: Product) =>
    product.stock > 0 && totalMoney >= product.price;

  console.log(insertedMoney);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 border-b border-purple-500/30 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Vending Machine</h1>
          <Link href="/auth/login">
            <Button variant="outline" className="text-black border-black">
              Login
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Select Your Product
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Insert money and choose your item
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => selectProduct(product)}
                      disabled={product.stock === 0}
                      className="h-full text-left disabled:cursor-not-allowed"
                    >
                      <Card
                        className={`
    h-[260px]
    flex flex-col
    border
    transition-all
    duration-200

    ${
      product.stock === 0
        ? "bg-slate-800/40 border-slate-600 opacity-60"
        : canBuyProduct(product)
        ? "bg-slate-700/70 border-green-500 ring-2 ring-green-500/70 shadow-lg"
        : "bg-slate-700/40 border-white/10 hover:ring-2 hover:ring-purple-500"
    }
  `}
                      >
                        <div className="relative h-28 w-full bg-white/90 flex items-center justify-center">
                          <img
                            src={`${product.image}`}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain p-2"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-3 flex flex-col justify-between text-center">
                          <div>
                            <p className="text-white text-sm font-medium truncate">
                              {product.name}
                            </p>
                            <p className="text-purple-300 font-bold">
                              {product.price} ฿
                            </p>
                          </div>

                          <p className="text-xs text-slate-400">
                            Stock: {product.stock}
                          </p>
                        </div>
                      </Card>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Money Panel */}
          <div className="space-y-4">
            <Card className="bg-emerald-700">
              <CardContent className="text-center p-6">
                <p className="text-5xl font-bold text-white">{totalMoney}</p>
                <p className="text-emerald-200">Thai Baht (฿)</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Insert Money</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Coins */}
                <div>
                  <p className="text-amber-300 text-sm mb-2">Coins</p>
                  <div className="grid grid-cols-3 gap-2">
                    {coinDenominations.map((value) => (
                      <Button
                        key={value}
                        onClick={() => insertMoney(value)}
                        className="bg-amber-600 hover:bg-amber-500 text-white"
                      >
                        {value} ฿
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Small Bills */}
                <div>
                  <p className="text-green-300 text-sm mb-2">Banknotes</p>
                  <div className="grid grid-cols-3 gap-2">
                    {banknoteDenominations.map((value) => (
                      <Button
                        key={value}
                        onClick={() => insertMoney(value)}
                        className="bg-green-600 hover:bg-green-500 text-white"
                      >
                        {value} ฿
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedProduct && (
              <Card className="bg-purple-600">
                <CardContent className="space-y-2">
                  <p className="text-white font-bold">{selectedProduct.name}</p>
                  <p className="text-white">Price: {selectedProduct.price} ฿</p>
                  <p className="text-white">
                    Change: {totalMoney - selectedProduct.price} ฿
                  </p>
                  <Button
                    className="w-full bg-white text-purple-600"
                    onClick={() => buyProduct(selectedProduct.id)}
                  >
                    Confirm Purchase
                  </Button>
                </CardContent>
              </Card>
            )}

            {(totalMoney > 0 || selectedProduct) && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={cancelTransaction}
              >
                Cancel & Return Money
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
