"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Power,
  Thermometer,
  Wifi,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MachineFunction() {
  const [machineStatus, setMachineStatus] = useState({
    power: true,
    temperature: 4,
    connection: true,
    lastMaintenance: "2024-01-10",
  });
  const { toast } = useToast();

  const togglePower = () => {
    setMachineStatus({ ...machineStatus, power: !machineStatus.power });
    toast({
      title: machineStatus.power ? "Machine Powered Off" : "Machine Powered On",
      description: "Machine power status updated",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Machine Function</h1>
        <p className="text-purple-200">
          Monitor and control vending machine operations
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Power Status
            </CardTitle>
            <Power className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge
                variant={machineStatus.power ? "default" : "destructive"}
                className="text-lg px-3 py-1"
              >
                {machineStatus.power ? "Online" : "Offline"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Temperature
            </CardTitle>
            <Thermometer className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {machineStatus.temperature}°C
            </div>
            <p className="text-xs text-purple-200">Cooling system active</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Connection
            </CardTitle>
            <Wifi className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {machineStatus.connection ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              <span className="text-white font-medium">
                {machineStatus.connection ? "Connected" : "Disconnected"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Last Maintenance
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">
              {machineStatus.lastMaintenance}
            </div>
            <p className="text-xs text-purple-200">4 days ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Machine Controls</CardTitle>
          <CardDescription className="text-purple-200">
            Manage vending machine operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Power Control</h3>
              <p className="text-sm text-purple-200">Turn machine on or off</p>
            </div>
            <Button
              onClick={togglePower}
              variant={machineStatus.power ? "destructive" : "default"}
            >
              {machineStatus.power ? "Turn Off" : "Turn On"}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Temperature Adjustment</h3>
              <p className="text-sm text-purple-200">
                Adjust cooling temperature
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-slate-600 text-white border-purple-500/30"
                onClick={() =>
                  setMachineStatus({
                    ...machineStatus,
                    temperature: Math.max(0, machineStatus.temperature - 1),
                  })
                }
              >
                -
              </Button>
              <span className="px-4 py-2 bg-slate-600 rounded text-white font-medium">
                {machineStatus.temperature}°C
              </span>
              <Button
                variant="outline"
                className="bg-slate-600 text-white border-purple-500/30"
                onClick={() =>
                  setMachineStatus({
                    ...machineStatus,
                    temperature: Math.min(10, machineStatus.temperature + 1),
                  })
                }
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div>
              <h3 className="text-white font-medium">System Diagnostics</h3>
              <p className="text-sm text-purple-200">Run full system check</p>
            </div>
            <Button
              variant="outline"
              className="bg-purple-600 text-white border-purple-500"
            >
              Run Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
