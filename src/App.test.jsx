import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  test("renders user login component", () => {
    render(<App />);

    expect(screen.getByText("User Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
