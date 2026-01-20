// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { Bell } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { formatDistanceToNow } from "date-fns";

// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   created_at: string;
//   is_read: boolean;
//   order_id?: string;
// }

// export function NotificationProvider({
//   userId,
// }: {
//   userId: string | undefined;
// }) {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     if (!userId) return;

//     const supabase = createClient();

//     // Subscribe to order updates for real-time notifications
//     const channel = supabase
//       .channel("order-updates")
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "orders",
//           filter: `user_id=eq.${userId}`,
//         },
//         (payload) => {
//           const order = payload.new as any;
//           const notification: Notification = {
//             id: Date.now().toString(),
//             title: "Order Update",
//             message: `Your order #${order.id.slice(0, 8)} is now ${
//               order.status
//             }`,
//             created_at: new Date().toISOString(),
//             is_read: false,
//             order_id: order.id,
//           };
//           setNotifications((prev) => [notification, ...prev]);
//           setUnreadCount((prev) => prev + 1);
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [userId]);

//   const markAsRead = (id: string) => {
//     setNotifications((prev) =>
//       prev.map((notif) =>
//         notif.id === id ? { ...notif, is_read: true } : notif
//       )
//     );
//     setUnreadCount((prev) => Math.max(0, prev - 1));
//   };

//   const markAllAsRead = () => {
//     setNotifications((prev) =>
//       prev.map((notif) => ({ ...notif, is_read: true }))
//     );
//     setUnreadCount(0);
//   };

//   if (!userId) return null;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
//               {unreadCount}
//             </Badge>
//           )}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-80">
//         <div className="flex items-center justify-between p-2">
//           <h3 className="font-semibold">Notifications</h3>
//           {unreadCount > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={markAllAsRead}
//               className="text-xs"
//             >
//               Mark all as read
//             </Button>
//           )}
//         </div>
//         <DropdownMenuSeparator />
//         <div className="max-h-96 overflow-y-auto">
//           {notifications.length === 0 ? (
//             <div className="p-4 text-center text-sm text-muted-foreground">
//               No notifications yet
//             </div>
//           ) : (
//             notifications.slice(0, 10).map((notification) => (
//               <DropdownMenuItem
//                 key={notification.id}
//                 className="flex flex-col items-start gap-1 p-3 cursor-pointer"
//                 onClick={() => markAsRead(notification.id)}
//               >
//                 <div className="flex items-start justify-between w-full">
//                   <div className="flex-1">
//                     <p className="font-medium text-sm">{notification.title}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {notification.message}
//                     </p>
//                   </div>
//                   {!notification.is_read && (
//                     <div className="h-2 w-2 rounded-full bg-primary ml-2 shrink-0" />
//                   )}
//                 </div>
//                 <span className="text-xs text-muted-foreground">
//                   {formatDistanceToNow(new Date(notification.created_at), {
//                     addSuffix: true,
//                   })}
//                 </span>
//               </DropdownMenuItem>
//             ))
//           )}
//         </div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { Bell } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { formatDistanceToNow } from "date-fns";

// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   created_at: string;
//   is_read: boolean;
//   resource_id: string | null;
// }

// export function NotificationProvider({ userId }: { userId?: string }) {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const supabase = createClient();

//   /* ---------- INITIAL LOAD ---------- */
//   useEffect(() => {
//     if (!userId) return;

//     const loadNotifications = async () => {
//       const { data } = await supabase
//         .from("notifications")
//         .select("id, title, message, created_at, is_read, resource_id")
//         .eq("user_id", userId)
//         .order("created_at", { ascending: false })
//         .limit(20);

//       if (data) setNotifications(data);
//     };

//     loadNotifications();
//   }, [userId, supabase]);

//   /* ---------- REALTIME INSERT ---------- */
//   useEffect(() => {
//     if (!userId) return;

//     const channel = supabase
//       .channel("notifications-realtime")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "notifications",
//           filter: `user_id=eq.${userId}`,
//         },
//         (payload) => {
//           if (document.visibilityState === "visible") {
//             const audio = new Audio("/sound/notification.wav");
//             audio.volume = 0.6;
//             audio.play().catch(() => {});
//           }
//           setNotifications((prev) => [payload.new as Notification, ...prev]);
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [userId, supabase]);

//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   /* ---------- ACTIONS ---------- */
//   const markAsRead = async (id: string) => {
//     await supabase.from("notifications").update({ is_read: true }).eq("id", id);

//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
//     );
//   };

//   const markAllAsRead = async () => {
//     await supabase
//       .from("notifications")
//       .update({ is_read: true })
//       .eq("user_id", userId);

//     setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
//   };

//   if (!userId) return null;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="relative touch-manipulation"
//         >
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge className="absolute -top-1 -right-1 h-5 w-5 min-w-5 p-0 text-xs flex items-center justify-center">
//               {unreadCount > 9 ? "9+" : unreadCount}
//             </Badge>
//           )}
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         align="end"
//         side="bottom"
//         className="w-69 sm:w-96 max-w-[calc(100vw-2rem)] sm:mr-0"
//       >
//         <div className="flex items-center justify-between p-2 px-3">
//           <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>
//           {unreadCount > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={markAllAsRead}
//               className="text-xs h-8 px-2"
//             >
//               Mark all read
//             </Button>
//           )}
//         </div>

//         <DropdownMenuSeparator />

//         <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
//           {notifications.length === 0 ? (
//             <div className="p-6 text-center text-sm text-muted-foreground">
//               No notifications yet
//             </div>
//           ) : (
//             notifications.slice(0, 10).map((n) => (
//               <DropdownMenuItem
//                 key={n.id}
//                 className="flex flex-col items-start gap-1 p-3 cursor-pointer active:bg-accent"
//                 onClick={() => markAsRead(n.id)}
//               >
//                 <div className="flex justify-between w-full gap-2">
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs font-medium truncate">{n.title}</p>
//                     <p className="text-xs text-muted-foreground line-clamp-2">
//                       {n.message}
//                     </p>
//                   </div>
//                   {!n.is_read && (
//                     <div className="h-2 w-2 bg-primary rounded-full mt-1 shrink-0" />
//                   )}
//                 </div>
//                 <span className="text-xs text-muted-foreground">
//                   {formatDistanceToNow(new Date(n.created_at), {
//                     addSuffix: true,
//                   })}
//                 </span>
//               </DropdownMenuItem>
//             ))
//           )}
//         </div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  resource_id: string | null;
}

export function NotificationProvider({ userId }: { userId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /* ---------- MEMOIZED CLIENT ---------- */
  const supabase = useMemo(() => createClient(), []);

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const loadNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, message, created_at, is_read, resource_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data && isMounted) {
        setNotifications(data);
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [userId, supabase]);

  /* ---------- REALTIME INSERT ---------- */
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;

          // 🔒 DEDUPE ON RECONNECT
          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotification.id)) {
              return prev;
            }
            return [newNotification, ...prev];
          });

          // 🔔 SOUND (ONLY WHEN VISIBLE)
          if (document.visibilityState === "visible") {
            const audio = new Audio("/sound/notification.wav");
            audio.volume = 0.6;
            audio.play().catch(() => {});
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /* ---------- ACTIONS ---------- */
  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  if (!userId) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 min-w-5 p-0 text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="bottom" className="w-96">
        <div className="flex items-center justify-between p-3">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-8 px-2"
            >
              Mark all read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.slice(0, 10).map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                onClick={() => markAsRead(n.id)}
              >
                <div className="flex justify-between w-full gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                  {!n.is_read && (
                    <div className="h-2 w-2 bg-primary rounded-full mt-1" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
