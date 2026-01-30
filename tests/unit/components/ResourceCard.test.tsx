import { render, screen } from "@testing-library/react";
import ResourceCard from "@/components/ResourceCard";

describe("ResourceCard", () => {
  const mockProps = {
    title: "Computer Science",
    subtitle: "Department",
    href: "/branch/cs",
  };

  test("renders the title and subtitle", () => {
    render(<ResourceCard {...mockProps} />);
    
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
  });

  test("renders the correct link", () => {
    render(<ResourceCard {...mockProps} />);
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/branch/cs");
  });

  test("renders the icon when provided", () => {
    const Icon = () => <span data-testid="mock-icon">Icon</span>;
    render(<ResourceCard {...mockProps} icon={<Icon />} />);
    
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });
});
