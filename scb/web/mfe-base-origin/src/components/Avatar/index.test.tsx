import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";
import useController from "./common/useController";
import { AvatarProps } from "./common/interface";

jest.mock('../../utils/locale', () => {
  return {
    DateTimeFormat: (t,v) => v,
  }
});

const Comp = (props: AvatarProps) => {
  return (<Root {...props} />);
};
const Comp2 = (props: AvatarProps) => {
  const { handleOpenUserProfile, handleCloseUserProfile } = useController(props);
  React.useEffect(() => {
    handleOpenUserProfile();
    handleCloseUserProfile();
  }, [])
  return (<Root {...props} />);
};

describe("Avatar component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Comp setOpen={() => { }} />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const iconButton = screen.getByTestId(`${PREFIX}_IconButton`);
    expect(iconButton).toBeInTheDocument();
    iconButton.click();
    
    const profile = screen.getByTestId(`${PREFIX}_Profile`);
    expect(profile).toBeInTheDocument();
    profile.click();
  });
  it("should be in the document", () => {
    render(<Provider data={{ user: { fullName: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Comp setOpen={() => { }} />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const iconButton = screen.getByTestId(`${PREFIX}_IconButton`);
    expect(iconButton).toBeInTheDocument();
    iconButton.click();
    const version = screen.getByTestId(`${PREFIX}_Version`);
    expect(version).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.getByText(/123/i)).toBeInTheDocument();
    const Logout = screen.getByTestId(`${PREFIX}_Logout`);
    expect(Logout).toBeInTheDocument();
    Logout.click();
  });
  it("should be in the document", () => {
    render(<Provider data={{ user: { fullName: "123", id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <Comp2 setOpen={() => { }} />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
