"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/primitives/avatar";
import { SidebarHeader } from "@/components/primitives/sidebar";
import { UserState } from "@/lib/client-only/stores/user/user.state";
import React from "react";

const SidebarHeaderMemo = React.memo(function SidebarHeaderMemo({ user }: { user: UserState }) {
    console.log('se renderiza el sidebar header');
    return (
    <SidebarHeader>
      <div className="flex items-center gap-3 px-2 py-4">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user?.avatar || "/placeholder.svg?height=32&width=32"}
            alt="Usuario"
          />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium ">{user?.name}</span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
      </div>
    </SidebarHeader>
  );
});

export default SidebarHeaderMemo;
