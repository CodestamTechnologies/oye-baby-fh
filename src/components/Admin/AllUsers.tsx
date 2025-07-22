"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/authProvider";

import type { Order } from "@/lib/types";

type FirestoreUserData = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: string | null;
  createdAt: string;
  orders?: Order[];
};

export default function UserAndOrdersPage() {
  const { allusers } = useAuth();

  const [selectedUser, setSelectedUser] = useState<FirestoreUserData | null>(
    null
  );

  return (
    <div className="p-6 h-screen">
      <h1 className="text-2xl font-bold mb-6">Users and Their Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allusers?.map((user) => (
          <Card key={user.uid}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={user?.photoURL || ""}
                  alt={user?.displayName || ""}
                />
                <AvatarFallback>{user?.displayName?.[0] || ""}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{user.displayName}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-600">
                <strong>Created:</strong>{" "}
                {new Date(user.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Last Login:</strong>{" "}
                {new Date(user.lastLogin).toLocaleString()}
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setSelectedUser(user)}
                    variant="outline"
                  >
                    View Orders
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg overflow-y-auto h-fl h-[90%] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>
                      Orders for {selectedUser?.displayName}
                    </DialogTitle>
                  </DialogHeader>

                  {selectedUser?.orders?.length ? (
                    <ul className="space-y-3 mt-4 ">
                      {selectedUser.orders.map((order) => (
                        <li
                          key={order.id}
                          className="border rounded p-3 text-sm "
                        >
                          <p>
                            <strong>Order ID:</strong> {order.id}
                          </p>
                          <p>
                            <strong>Total:</strong> ₹{order.total}
                          </p>
                          {/* <p>
                            <strong>Status:</strong> {order?.status}
                          </p> */}
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(order?.createdAt).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground mt-4 text-sm">
                      No orders available.
                    </p>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
