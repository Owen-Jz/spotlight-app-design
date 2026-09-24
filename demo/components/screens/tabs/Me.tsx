"use client";

import { Settings } from "lucide-react";
import { useNav } from "../../nav";
import { MeFan } from "../profile/MeFan";
import { RoleSwitch } from "../profile/MeParts";
import { MeScout } from "../profile/MeScout";
import { MeTalent } from "../profile/MeTalent";
import { Page, IconBtn } from "./common";

/* ---------------- Me: a different profile for talent, fans and scouts ---------------- */

export function Me() {
  const { push, user } = useNav();
  return (
    <Page
      title="Me"
      right={
        <IconBtn onClick={() => push({ name: "settings" })} label="Settings">
          <Settings size={19} />
        </IconBtn>
      }
    >
      {user.role === "talent" ? <MeTalent key="talent" /> : user.role === "brand" ? <MeScout key="brand" /> : <MeFan key="fan" />}
      <RoleSwitch />
    </Page>
  );
}
