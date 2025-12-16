"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, ShoppingCart, TrendingUp, Calendar } from "lucide-react";

interface SaleRecord {
  id: string;
  date: string;
  time: string;
  product: string;
  slot: string;
  quantity: number;
  price: number;
  total: number;
}

const salesHistory: SaleRecord[] = [
  {
    id: "1",
    date: "2024-01-14",
    time: "14:35",
    product: "Coca Cola",
    slot: "A1",
    quantity: 1,
    price: 35,
    total: 35,
  },
  {
    id: "2",
    date: "2024-01-14",
    time: "13:22",
    product: "Lays Chips",
    slot: "B1",
    quantity: 2,
    price: 45,
    total: 90,
  },
  {
    id: "3",
    date: "2024-01-14",
    time: "12:45",
    product: "Water",
    slot: "A3",
    quantity: 1,
    price: 20,
    total: 20,
  },
  {
    id: "4",
    date: "2024-01-14",
    time: "11:30",
    product: "Snickers",
    slot: "C1",
    quantity: 3,
    price: 40,
    total: 120,
  },
  {
    id: "5",
    date: "2024-01-14",
    time: "10:15",
    product: "Energy Drink",
    slot: "A4",
    quantity: 1,
    price: 60,
    total: 60,
  },
  {
    id: "6",
    date: "2024-01-13",
    time: "18:20",
    product: "KitKat",
    slot: "C2",
    quantity: 2,
    price: 35,
    total: 70,
  },
  {
    id: "7",
    date: "2024-01-13",
    time: "17:45",
    product: "Doritos",
    slot: "B2",
    quantity: 1,
    price: 50,
    total: 50,
  },
  {
    id: "8",
    date: "2024-01-13",
    time: "16:30",
    product: "Pepsi",
    slot: "A2",
    quantity: 2,
    price: 35,
    total: 70,
  },
  {
    id: "9",
    date: "2024-01-13",
    time: "15:10",
    product: "Coca Cola",
    slot: "A1",
    quantity: 1,
    price: 35,
    total: 35,
  },
  {
    id: "10",
    date: "2024-01-13",
    time: "14:05",
    product: "Water",
    slot: "A3",
    quantity: 3,
    price: 20,
    total: 60,
  },
];

export default function AnalystDashboard() {
  const [timeframe, setTimeframe] = useState("today");

  const getFilteredSales = () => {
    const today = "2024-01-14";
    const yesterday = "2024-01-13";

    if (timeframe === "today") {
      return salesHistory.filter((sale) => sale.date === today);
    } else if (timeframe === "yesterday") {
      return salesHistory.filter((sale) => sale.date === yesterday);
    } else if (timeframe === "week") {
      return salesHistory;
    }
    return salesHistory;
  };

  const filteredSales = getFilteredSales();

  const getTotalRevenue = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const getTotalTransactions = () => {
    return filteredSales.length;
  };

  const getTotalItems = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
  };

  const getAverageTransaction = () => {
    const total = getTotalRevenue();
    const count = getTotalTransactions();
    return count > 0 ? total / count : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sales Analyst</h1>
          <p className="text-purple-200">Track revenue and sales performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-300" />
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px] bg-slate-700 border-purple-500/30 text-white">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-purple-500/30">
              <SelectItem value="today" className="text-white">
                Today
              </SelectItem>
              <SelectItem value="yesterday" className="text-white">
                Yesterday
              </SelectItem>
              <SelectItem value="week" className="text-white">
                This Week
              </SelectItem>
              <SelectItem value="month" className="text-white">
                This Month
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-600 to-emerald-700 border-green-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {getTotalRevenue()} ฿
            </div>
            <p className="text-xs text-green-100 mt-1">
              {timeframe === "today"
                ? "Today's earnings"
                : `${timeframe} earnings`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Transactions
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {getTotalTransactions()}
            </div>
            <p className="text-xs text-purple-200 mt-1">Total sales</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Items Sold
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {getTotalItems()}
            </div>
            <p className="text-xs text-purple-200 mt-1">Total units</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Avg. Transaction
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {getAverageTransaction().toFixed(0)} ฿
            </div>
            <p className="text-xs text-purple-200 mt-1">Per sale</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales History Table */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Sales History</CardTitle>
          <CardDescription className="text-purple-200">
            Detailed transaction records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/30 hover:bg-transparent">
                <TableHead className="text-purple-200">Date</TableHead>
                <TableHead className="text-purple-200">Time</TableHead>
                <TableHead className="text-purple-200">Slot</TableHead>
                <TableHead className="text-purple-200">Product</TableHead>
                <TableHead className="text-purple-200">Quantity</TableHead>
                <TableHead className="text-purple-200">Price (฿)</TableHead>
                <TableHead className="text-right text-purple-200">
                  Total (฿)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow
                  key={sale.id}
                  className="border-purple-500/30 hover:bg-purple-500/10"
                >
                  <TableCell className="text-white">{sale.date}</TableCell>
                  <TableCell className="text-purple-200">{sale.time}</TableCell>
                  <TableCell className="text-white font-medium">
                    {sale.slot}
                  </TableCell>
                  <TableCell className="text-white">{sale.product}</TableCell>
                  <TableCell className="text-purple-200">
                    {sale.quantity}
                  </TableCell>
                  <TableCell className="text-purple-200">
                    {sale.price}
                  </TableCell>
                  <TableCell className="text-right text-white font-medium">
                    {sale.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSales.length === 0 && (
            <div className="text-center py-8">
              <p className="text-purple-200">
                No sales data for selected timeframe
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
