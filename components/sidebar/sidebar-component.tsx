"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/primitives/sidebar";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { signOutFirebase } from "@/lib/firebase/actions";
import { BarChart, Home, LogOut, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../primitives/avatar";
import { Button } from "../primitives/button";

const items = [
  { title: "Inicio", url: "/overview", icon: Home },
  { title: "Configuración", url: "/profile", icon: Settings },
  { title: "Analizar", url: "/analyze", icon: BarChart },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { clearUser, user } = useUserStore();
  const onLogout = async () => {
    await signOutFirebase();
    clearUser();
    router.push("/");
  };
  return (
    <Sidebar>
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-2 ${
                          isActive ? "bg-muted text-primary" : ""
                        }`}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 px-2"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span className="text-red-500">Cerrar sesión</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
