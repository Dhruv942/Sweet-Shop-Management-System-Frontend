import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App Component", () => {
  test("renders home page by default", () => {
    render(<App />);

    expect(screen.getByText("Welcome to Sweet Shop")).toBeInTheDocument();
    expect(screen.getAllByText("Sign In")[0]).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });
});
