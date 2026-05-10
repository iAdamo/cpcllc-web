"use client";
import { useState } from "react";
import AccountDeactivation from "@/screens/auth/deletion";
import useGlobalStore from "@/stores";

export default function AccountControlPage() {
  const [open, setOpen] = useState(false);
  const { logout } = useGlobalStore();

  return (
    <>
      <button onClick={() => setOpen(true)}>Delete account</button>
      <AccountDeactivation
        isOpen={open}
        onClose={() => setOpen(false)}
        onDeactivate={async ({ password, reason, shouldDeleteAfter30Days }) => {
          await logout({
            password: password,
            reason: reason,
            shouldDeleteAfter30Days,
          });
          // await yourApi.deactivateAccount({
          //   password,
          //   reason,
          //   shouldDeleteAfter30Days,
          // });
        }}
      />
    </>
  );
}
