"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/primitives/sidebar";
import { UserState } from "@/lib/client-only/stores/user/user.state";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { signOutFirebase } from "@/lib/firebase/actions";
import { BarChart3, Home, List, LogOut, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../primitives/button";
import SidebarHeaderMemo from "./sidebar-header";

const items = [
  { title: "Inicio", url: "/overview", icon: Home },
  { title: "Configuración", url: "/profile", icon: Settings },
  { title: "Mis Análisis", url: "/my-analyses", icon: List },
  { title: "Analizar", url: "/analyzer", icon: BarChart3 },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { clearUser, user } = useUserStore();
  const onLogout = async () => {
    try {
      await signOutFirebase();
      clearUser();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Sidebar>
      <SidebarHeaderMemo user={user as UserState} />
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
