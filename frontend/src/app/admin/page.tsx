"use client";

import { useEffect, useState } from "react";
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
import {
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/service/auth/auth.service";
import { useRouter } from "next/navigation";
import { adminService } from "@/service/admin/admin.service";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  total_sold: number;
}

interface ProductFormValues {
  name: string;
  price: number;
  stock: number;
  image?: File;
}

interface MoneyItem {
  denomination: number;
  quantity: number;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    stock: string;
    image?: File;
  }>({
    name: "",
    price: "",
    stock: "",
  });
  const [balance, setBalance] = useState<MoneyItem[]>([]);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    adminService.getProducts().then(setProducts);
    adminService.getBalance().then(setBalance);
  }, []);

  const { toast } = useToast();
  const router = useRouter();
  const logout = () => {
    authService.logout();
    toast({
      title: "Logout",
      description: "You have been logged out successfully",
    });
    router.push("/");
  };

  const getTotalRevenue = () => {
    return products.reduce(
      (sum, product) => sum + (product.total_sold || 0) * product.price,
      0
    );
  };

  const getTotalStock = () => {
    return products.reduce((sum, product) => sum + product.stock, 0);
  };

  const getTotalSold = () => {
    return products.reduce(
      (sum, product) => sum + (product.total_sold || 0),
      0
    );
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("price", formData.price);
    fd.append("stock", formData.stock);

    if (formData.image) {
      fd.append("image", formData.image);
    }

    await adminService.addProduct(fd);

    toast({
      title: "Product Added",
      description: `${formData.name} added successfully`,
    });

    setIsAddDialogOpen(false);
    setFormData({ name: "", price: "", stock: "" });
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("price", formData.price);
    fd.append("stock", formData.stock);

    if (formData.image) {
      fd.append("image", formData.image);
    }

    try {
      const updated = await adminService.updateProduct(editingProduct.id, fd);

      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );

      toast({
        title: "Product Updated",
        description: `${updated.name} updated successfully`,
      });

      setIsEditDialogOpen(false);
      setEditingProduct(null);
      setFormData({ name: "", price: "", stock: "" });
    } catch {
      toast({
        title: "Update Failed",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      await adminService.deleteProduct(productId);

      setProducts((prev) => prev.filter((p) => p.id !== productId));

      toast({
        title: "Product Deleted",
        description: `${product.name} has been removed`,
      });
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Unable to delete product",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: undefined,
    });
    setIsEditDialogOpen(true);
  };

  const getTotalBalance = () => {
    return balance.reduce(
      (sum, item) => sum + item.denomination * item.quantity,
      0
    );
  };

  const sortedBalance = [...balance].sort(
    (a, b) => a.denomination - b.denomination
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your vending machine inventory
            </p>
          </div>
          <Button onClick={() => logout()} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">฿{getTotalRevenue()}</div>
              <p className="text-xs text-muted-foreground">From all sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Items in Stock
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalStock()}</div>
              <p className="text-xs text-muted-foreground">Available items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalSold()}</div>
              <p className="text-xs text-muted-foreground">All time sales</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 border-blue-300 bg-blue-50">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-blue-900">Machine Balance</CardTitle>
              <CardDescription>Money available for change</CardDescription>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Balance</div>
              <div className="text-2xl font-bold text-blue-900">
                ฿{getTotalBalance().toLocaleString()}
              </div>

              <Button
                size="sm"
                className="mt-2"
                onClick={() => setIsBalanceDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Balance
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedBalance.map((item) => (
                <div
                  key={item.denomination}
                  className="rounded-lg border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">
                      ฿{item.denomination}
                    </span>
                    <Badge variant="secondary">x {item.quantity}</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">Subtotal</div>
                  <div className="text-lg font-bold">
                    ฿{(item.denomination * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={isBalanceDialogOpen}
          onOpenChange={setIsBalanceDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Balance</DialogTitle>
              <DialogDescription>
                Update money quantity in machine
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {sortedBalance.map((item, index) => (
                <div
                  key={item.denomination}
                  className="flex items-center gap-4"
                >
                  <Label className="w-24">฿{item.denomination}</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const quantity = Number(e.target.value);

                      setBalance((prev) =>
                        prev.map((b) =>
                          b.denomination === item.denomination
                            ? { ...b, quantity }
                            : b
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsBalanceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const updated = await adminService.setBalance(balance);
                  setBalance(updated);
                  toast({
                    title: "Balance Updated",
                    description: "Machine balance saved successfully",
                  });
                  setIsBalanceDialogOpen(false);
                }}
              >
                Save Balance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove products from your vending machine
                </CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new product to inventory
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="add-name">Product Name</Label>
                      <Input
                        id="add-name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="add-price">Price (฿)</Label>
                      <Input
                        id="add-price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="add-stock">Stock Quantity</Label>
                      <Input
                        id="add-stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="add-image">Image (optional)</Label>
                      <Input
                        id="add-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, image: file });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddProduct}>Add Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Total Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-contain cursor-pointer"
                          onClick={() => setPreview(product.image)}
                        />
                        <Dialog
                          open={!!preview}
                          onOpenChange={() => setPreview(null)}
                        >
                          <DialogContent className="max-w-xl">
                            <img
                              src={preview || ""}
                              className="w-full h-[400px] object-contain"
                            />
                          </DialogContent>
                        </Dialog>

                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>฿{product.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.stock <= 5 ? "destructive" : "secondary"
                        }
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.total_sold || 0}</TableCell>
                    <TableCell>
                      ฿{((product.total_sold || 0) * product.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setProductToDelete(product)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Dialog
                          open={!!productToDelete}
                          onOpenChange={() => setProductToDelete(null)}
                        >
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Product</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete{" "}
                                <span className="font-semibold">
                                  {productToDelete?.name}
                                </span>
                                ? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setProductToDelete(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={async () => {
                                  if (!productToDelete) return;

                                  await handleDeleteProduct(productToDelete.id);
                                  setProductToDelete(null);
                                }}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price (฿)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-stock">Stock Quantity</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Image (optional)</Label>
              {editingProduct && (
                <div className="w-full h-64 rounded-md border bg-muted flex items-center justify-center">
                  <img
                    src={editingProduct.image}
                    alt="current product"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, image: file });
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
