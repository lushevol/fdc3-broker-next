import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { ThemeProvider, createTheme } from "ratan-design-origin/theme";
import type { Entity, User } from "../hooks/model/root";
import { PrototypeProfile } from "./profile-presentation";

const entities: Entity[] = [
  { id: 1, applicationName: "RATAN", name: "X_RATANONE", roleId: 11,
    roleName: "FMO_COO_SUP", subjects: [
      { id: 101, name: "RATAN_FM_COO_EXCEPTION", actions: [] },
      { id: 102, name: "RATAN_TRADE_BLOTTER", actions: [] },
    ] },
  { id: 2, applicationName: "FLOW_ZERO", name: "FLOW_ZERO", roleId: 12,
    roleName: "QA", subjects: [{ id: 103, name: "RATAN_FM_COO_EXCEPTION", actions: [] }] },
  { id: 3, applicationName: "RATAN", name: "RATAN_DATA_ENTITLEMENT", roleId: 13,
    roleName: "Global", subjects: [{ id: 104, name: "REGION", actions: [] }] },
];
const user: User = {
  fullName: "Yating, Yang", userId: "8227715", auth_time: Date.parse("2026-09-21T01:05:06Z") / 1000,
  oud: { userId: "8227715", emailId: "Yating.yang@sc.com", country: "CN" },
  entitlements: {
    "X_RATANONE:FMO_COO_SUP": { RATAN_FM_COO_EXCEPTION: ["F_Export_Data", "Access_FMO_POST_TRADE_PORTAL"] },
    "FLOW_ZERO:QA": { RATAN_FM_COO_EXCEPTION: ["UI_READ"] },
    "RATAN_DATA_ENTITLEMENT:Global": { REGION: ["VIEW_ENTITLEMENT"] },
  },
};

const showProfile = (overrides: Partial<React.ComponentProps<typeof PrototypeProfile>> = {}) =>
  render(<ThemeProvider theme={createTheme()}><PrototypeProfile open mode="light"
    user={user} entities={entities} expiredIn={1789925400} timeType="UTC"
    onClose={vi.fn()} {...overrides} /></ThemeProvider>);

describe("prototype profile", () => {
  it.each(["light", "dark"] as const)("keeps 48px entitlement rows and semantic text roles in %s mode", (mode) => {
    showProfile({ mode });
    const role = screen.getByRole("button", { name: "RATAN::X_RATANONE::FMO_COO_SUP" });
    expect(role).toHaveStyle({ minHeight: "48px" });
    expect(screen.getByRole("heading", { name: "Yating, Yang", level: 3 })).toHaveStyle({
      fontSize: "20px", lineHeight: "26px",
    });
    expect(within(role).getByText("RATAN::X_RATANONE::FMO_COO_SUP")).toHaveStyle({
      fontSize: "14px", lineHeight: "20px",
    });
    fireEvent.click(role);
    const subject = screen.getByRole("button", { name: "RATAN_FM_COO_EXCEPTION" });
    expect(subject).toHaveStyle({ minHeight: "48px" });
    fireEvent.click(subject);
    expect(screen.getByText("F_Export_Data")).toHaveStyle({
      fontSize: "12px", lineHeight: "18px",
    });
  });
  it("shows real identity, session values and separate functional/data entitlement groups", () => {
    showProfile();
    const dialog = screen.getByRole("dialog", { name: "User Profile" });
    expect(within(dialog).getByText("Yating, Yang")).toBeVisible();
    expect(within(dialog).getByText("8227715")).toBeVisible();
    expect(within(dialog).getByText("Yating.yang@sc.com")).toBeVisible();
    expect(within(dialog).getByText("CN")).toBeVisible();
    expect(within(dialog).getByText(/Login time:/)).toHaveTextContent("Sep 21, 2026");
    expect(within(dialog).getByText("Functional User Profile")).toBeVisible();
    expect(within(dialog).getByText("Entitlement User Profile")).toBeVisible();
    expect(within(dialog).getByRole("button", { name: "RATAN::X_RATANONE::FMO_COO_SUP" }))
      .toHaveAttribute("aria-expanded", "false");
    expect(within(dialog).queryByText("F_Export_Data")).not.toBeInTheDocument();
    expect(within(dialog).getByRole("img", { name: "Yating, Yang profile photo" }))
      .toHaveAttribute("src", "https://leap.standardchartered.com/tsp-profile/pics/8227715/photo_lg.jpg");
  });

  it("expands one role and its subjects, renders granted actions and reports the original analytics names", () => {
    const onExpansion = vi.fn();
    showProfile({ onExpansion });
    const role = screen.getByRole("button", { name: "RATAN::X_RATANONE::FMO_COO_SUP" });
    fireEvent.click(role);
    expect(role).toHaveAttribute("aria-expanded", "true");
    const subject = screen.getByRole("button", { name: "RATAN_FM_COO_EXCEPTION" });
    fireEvent.click(subject);
    expect(subject).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("F_Export_Data")).toBeVisible();
    expect(screen.getByText("Access_FMO_POST_TRADE_PORTAL")).toBeVisible();
    expect(onExpansion).toHaveBeenNthCalledWith(1, { name: "RATAN :: X_RATANONE :: FMO_COO_SUP", value: "true" });
    expect(onExpansion).toHaveBeenNthCalledWith(2, { name: "RATAN_FM_COO_EXCEPTION", value: "true" });
    fireEvent.click(subject);
    expect(subject).toHaveAttribute("aria-expanded", "false");
    expect(onExpansion).toHaveBeenLastCalledWith({ name: "RATAN_FM_COO_EXCEPTION", value: "false" });
    fireEvent.click(screen.getByRole("button", { name: "FLOW_ZERO::FLOW_ZERO::QA" }));
    expect(role).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(screen.getByRole("button", { name: "RATAN_FM_COO_EXCEPTION" }));
    expect(screen.getByText("UI_READ")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "FLOW_ZERO::FLOW_ZERO::QA" }));
    expect(onExpansion).toHaveBeenLastCalledWith({ name: "FLOW_ZERO :: FLOW_ZERO :: QA", value: "false" });
  });

  it("keeps required entitlements readable with missing mappings, long identity and absent photos/session values", () => {
    showProfile({ user: { fullName: "A very long profile display name ".repeat(8),
      oud: { title: "Operations Supervisor" } }, expiredIn: undefined });
    const dialog = screen.getByRole("dialog", { name: "User Profile" });
    expect(within(dialog).getByText("Operations Supervisor")).toBeVisible();
    expect(within(dialog).getByText(/Login time:/)).toHaveTextContent("Not available");
    expect(within(dialog).getByText(/Session Expired time:/)).toHaveTextContent("Not available");
    expect(within(dialog).getByRole("img", { name: /profile photo unavailable/ })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "RATAN::X_RATANONE::FMO_COO_SUP" }));
    fireEvent.click(screen.getByRole("button", { name: "RATAN_FM_COO_EXCEPTION" }));
    expect(within(dialog).getByText("No permitted actions available.")).toBeVisible();
  });

  it("keeps the identity outside the scrollable hierarchy as the dialog grows, using dark semantic surfaces", () => {
    showProfile({ mode: "dark" });
    const hierarchy = screen.getByRole("region", { name: "Profile entitlements" });
    const paper = screen.getByRole("dialog", { name: "User Profile" });
    expect(paper).toHaveStyle({ backgroundColor: "#1a1a1a", width: "800px", height: "auto" });
    expect(hierarchy).toHaveStyle({ overflowY: "auto" });
    expect(within(hierarchy).queryByText("Yating, Yang")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "RATAN::X_RATANONE::FMO_COO_SUP" }));
    expect(paper).toHaveStyle({ height: "800px" });
    const first = screen.getByRole("button", { name: "RATAN_FM_COO_EXCEPTION" });
    fireEvent.click(first);
    fireEvent.click(screen.getByRole("button", { name: "RATAN_TRADE_BLOTTER" }));
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "RATAN_TRADE_BLOTTER" })).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "RATAN::RATAN_DATA_ENTITLEMENT::Global" }));
    fireEvent.click(screen.getByRole("button", { name: "REGION" }));
    expect(screen.getByText("VIEW_ENTITLEMENT")).toBeVisible();
  });

  it("handles empty identity/groups and invalid session values without inventing dates or photos", () => {
    showProfile({ user: undefined, entities: undefined, expiredIn: Number.NaN, timeType: undefined });
    const dialog = screen.getByRole("dialog", { name: "User Profile" });
    expect(within(dialog).getByRole("heading", { name: "User", level: 3 })).toBeVisible();
    expect(within(dialog).getByText("No functional profiles available.")).toBeVisible();
    expect(within(dialog).queryByText("Entitlement User Profile")).not.toBeInTheDocument();
    expect(within(dialog).getByText(/Session Expired time:/)).toHaveTextContent("Not available");
    expect(within(dialog).getByRole("img", { name: "User profile photo unavailable" })).toBeVisible();
  });

  it("uses optional root identity values and refreshes a failed live photo when the user changes", () => {
    const props = { ...user, fullName: undefined, oud: undefined, emailId: "root@sc.com", country: "SG" };
    const view = showProfile({ user: props });
    expect(screen.getByRole("heading", { name: "8227715", level: 3 })).toBeVisible();
    expect(screen.getByText("root@sc.com")).toBeVisible();
    expect(screen.getByText("SG")).toBeVisible();
    fireEvent.error(screen.getByRole("img", { name: "8227715 profile photo" }));
    expect(screen.getByRole("img", { name: "8227715 profile photo unavailable" })).toBeVisible();
    view.rerender(<ThemeProvider theme={createTheme()}><PrototypeProfile open mode="light" user={{ userId: "new/id", oud: { fullName: "New User" } }}
      entities={[]} onClose={vi.fn()} /></ThemeProvider>);
    expect(screen.getByRole("img", { name: "New User profile photo" })).toHaveAttribute("src",
      "https://leap.standardchartered.com/tsp-profile/pics/new%2Fid/photo_lg.jpg");
  });

  it("keeps ARIA relationships unique for repeated role/subject labels", () => {
    const repeated = { ...entities[0], subjects: [entities[0].subjects[0], entities[0].subjects[0]] };
    showProfile({ entities: [repeated, { ...repeated, roleId: 99 }] });
    const roles = screen.getAllByRole("button", { name: "RATAN::X_RATANONE::FMO_COO_SUP" });
    fireEvent.click(roles[0]);
    const subjects = screen.getAllByRole("button", { name: "RATAN_FM_COO_EXCEPTION" });
    expect(subjects[0].id).not.toBe(subjects[1].id);
    expect(subjects[0].getAttribute("aria-controls")).not.toBe(subjects[1].getAttribute("aria-controls"));
    fireEvent.click(subjects[1]);
    expect(subjects[1]).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(roles[1]);
    expect(roles[0]).toHaveAttribute("aria-expanded", "false");
    expect(roles[0].id).not.toBe(roles[1].id);
  });

  it("shows an empty subject message and preserves unknown application metadata safely", () => {
    showProfile({ entities: [{ ...entities[0], applicationName: undefined as unknown as string, subjects: [] }] });
    fireEvent.click(screen.getByRole("button", { name: "*::X_RATANONE::FMO_COO_SUP" }));
    expect(screen.getByText("No subjects available.")).toBeVisible();
  });

  it("closes through the X or Escape and restores focus to the launching button", async () => {
    const Host = () => {
      const [open, setOpen] = React.useState(false);
      return <ThemeProvider theme={createTheme()}><button onClick={() => setOpen(true)}>View profile</button>
        <PrototypeProfile open={open} mode="light" user={user} entities={entities} onClose={() => setOpen(false)} />
      </ThemeProvider>;
    };
    render(<Host />);
    const launch = screen.getByRole("button", { name: "View profile" });
    launch.focus();
    fireEvent.click(launch);
    expect(screen.getByRole("dialog", { name: "User Profile" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Close User Profile" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(launch).toHaveFocus();
    fireEvent.click(launch);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape", code: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(launch).toHaveFocus();
  });

  it("responds to reduced-motion changes while keeping role dispatch immediate", async () => {
    let matches = false;
    let listener = () => {};
    const removeListener = vi.fn();
    vi.stubGlobal("matchMedia", vi.fn(() => ({ get matches() { return matches; },
      addEventListener: (_name: string, notify: () => void) => { listener = notify; },
      removeEventListener: removeListener })));
    const view = showProfile();
    act(() => { matches = true; listener(); });
    const role = screen.getByRole("button", { name: "RATAN::X_RATANONE::FMO_COO_SUP" });
    fireEvent.click(role);
    expect(screen.getByRole("button", { name: "RATAN_FM_COO_EXCEPTION" })).toBeVisible();
    fireEvent.click(role);
    expect(role).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(screen.queryByRole("button", { name: "RATAN_FM_COO_EXCEPTION" })).not.toBeInTheDocument());
    view.unmount();
    expect(removeListener).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
