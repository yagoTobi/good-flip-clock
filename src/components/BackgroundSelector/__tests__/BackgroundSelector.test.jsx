import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../../../contexts/ThemeContext";
import BackgroundSelector from "../BackgroundSelector";

// Mock component to test BackgroundSelector
const TestWrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

describe("BackgroundSelector", () => {
  test("renders background options", () => {
    render(
      <TestWrapper>
        <BackgroundSelector />
      </TestWrapper>
    );

    expect(screen.getByText("Background")).toBeInTheDocument();
    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.getByText("Blue Gradient")).toBeInTheDocument();
    expect(screen.getByText("Sunset")).toBeInTheDocument();
  });

  test("selects background option when clicked", () => {
    render(
      <TestWrapper>
        <BackgroundSelector />
      </TestWrapper>
    );

    const sunsetOption = screen.getByText("Sunset").closest("button");
    fireEvent.click(sunsetOption);

    expect(sunsetOption).toHaveClass("selected");
  });

  test("has proper accessibility attributes", () => {
    render(
      <TestWrapper>
        <BackgroundSelector />
      </TestWrapper>
    );

    const defaultOption = screen.getByLabelText("Select Default background");
    expect(defaultOption).toBeInTheDocument();
    expect(defaultOption).toHaveAttribute("title", "Default");
  });
});
