"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  slot: string;
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Coca Cola",
    price: 35,
    stock: 12,
    category: "Drinks",
    image: "/refreshing-cola-can.png",
    slot: "A1",
  },
  {
    id: "2",
    name: "Pepsi",
    price: 35,
    stock: 10,
    category: "Drinks",
    image: "/refreshing-soda-can.png",
    slot: "A2",
  },
  {
    id: "3",
    name: "Water",
    price: 20,
    stock: 15,
    category: "Drinks",
    image: "/reusable-water-bottle.png",
    slot: "A3",
  },
  {
    id: "4",
    name: "Lays Chips",
    price: 45,
    stock: 8,
    category: "Snacks",
    image: "/lays-chips-bag.jpg",
    slot: "B1",
  },
  {
    id: "5",
    name: "Doritos",
    price: 50,
    stock: 6,
    category: "Snacks",
    image: "/doritos-chips.jpg",
    slot: "B2",
  },
  {
    id: "6",
    name: "Snickers",
    price: 40,
    stock: 10,
    category: "Candy",
    image: "/snickers-bar.jpg",
    slot: "C1",
  },
  {
    id: "7",
    name: "KitKat",
    price: 35,
    stock: 12,
    category: "Candy",
    image: "/kitkat-bar.jpg",
    slot: "C2",
  },
  {
    id: "8",
    name: "Energy Drink",
    price: 60,
    stock: 5,
    category: "Drinks",
    image: "/energy-drink-can.png",
    slot: "A4",
  },
];

export default function ProductManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    slot: "",
    image: "",
  });
  const { toast } = useToast();

  const handleAddProduct = () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      !formData.category ||
      !formData.slot
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      category: formData.category,
      slot: formData.slot,
      image: formData.image || "/placeholder.svg",
    };

    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      slot: "",
      image: "",
    });
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added successfully`,
    });
  };

  const handleEditProduct = () => {
    if (
      !editingProduct ||
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      !formData.category
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            name: formData.name,
            price: Number.parseFloat(formData.price),
            stock: Number.parseInt(formData.stock),
            category: formData.category,
            slot: formData.slot,
            image: formData.image || product.image,
          }
        : product
    );

    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      slot: "",
      image: "",
    });
    toast({
      title: "Product Updated",
      description: "Product details have been updated successfully",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setProducts(products.filter((p) => p.id !== productId));
    toast({
      title: "Product Deleted",
      description: `${product?.name} has been removed`,
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      slot: product.slot,
      image: product.image,
    });
    setIsEditDialogOpen(true);
  };

  const getLowStockProducts = () => {
    return products.filter((p) => p.stock <= 5);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Product Management
          </h1>
          <p className="text-purple-200">Manage vending machine inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Product</DialogTitle>
              <DialogDescription className="text-purple-200">
                Fill in the details to add a new product to inventory
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="add-name" className="text-white">
                  Product Name
                </Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  className="bg-slate-700 border-purple-500/30 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="add-price" className="text-white">
                    Price (฿)
                  </Label>
                  <Input
                    id="add-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-stock" className="text-white">
                    Stock Quantity
                  </Label>
                  <Input
                    id="add-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="0"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="add-category" className="text-white">
                    Category
                  </Label>
                  <Input
                    id="add-category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Drinks, Snacks"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-slot" className="text-white">
                    Slot
                  </Label>
                  <Input
                    id="add-slot"
                    value={formData.slot}
                    onChange={(e) =>
                      setFormData({ ...formData, slot: e.target.value })
                    }
                    placeholder="e.g., A1, B2"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-image" className="text-white">
                  Image URL (optional)
                </Label>
                <Input
                  id="add-image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="Enter image URL"
                  className="bg-slate-700 border-purple-500/30 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="bg-slate-700 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProduct}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alert */}
      {getLowStockProducts().length > 0 && (
        <Card className="bg-orange-900/30 border-orange-500/50">
          <CardHeader>
            <CardTitle className="text-orange-200 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-orange-300">
              The following products need restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getLowStockProducts().map((product) => (
                <Badge
                  key={product.id}
                  variant="outline"
                  className="border-orange-400 text-orange-200"
                >
                  {product.slot} - {product.name} ({product.stock} left)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Table */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Inventory</CardTitle>
          <CardDescription className="text-purple-200">
            View and manage all products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30 hover:bg-transparent">
                <TableHead className="text-purple-200">Slot</TableHead>
                <TableHead className="text-purple-200">Product</TableHead>
                <TableHead className="text-purple-200">Category</TableHead>
                <TableHead className="text-purple-200">Price (฿)</TableHead>
                <TableHead className="text-purple-200">Stock</TableHead>
                <TableHead className="text-right text-purple-200">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-purple-500/30 hover:bg-purple-500/10"
                >
                  <TableCell className="text-white font-medium">
                    {product.slot}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="font-medium text-white">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-purple-200">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-white">{product.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock <= 5 ? "destructive" : "secondary"}
                      className={product.stock <= 5 ? "" : "bg-green-600"}
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(product)}
                        className="text-purple-300 hover:bg-purple-500/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Product</DialogTitle>
            <DialogDescription className="text-purple-200">
              Update the product details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-white">
                Product Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
                className="bg-slate-700 border-purple-500/30 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price" className="text-white">
                  Price (฿)
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0"
                  className="bg-slate-700 border-purple-500/30 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock" className="text-white">
                  Stock Quantity
                </Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="0"
                  className="bg-slate-700 border-purple-500/30 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category" className="text-white">
                  Category
                </Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Drinks, Snacks"
                  className="bg-slate-700 border-purple-500/30 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-slot" className="text-white">
                  Slot
                </Label>
                <Input
                  id="edit-slot"
                  value={formData.slot}
                  onChange={(e) =>
                    setFormData({ ...formData, slot: e.target.value })
                  }
                  placeholder="e.g., A1, B2"
                  className="bg-slate-700 border-purple-500/30 text-white"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image" className="text-white">
                Image URL (optional)
              </Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="Enter image URL"
                className="bg-slate-700 border-purple-500/30 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-slate-700 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditProduct}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
