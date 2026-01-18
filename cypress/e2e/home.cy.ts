describe("Home Page", () => {
  it("should load the home page and show the main buttons", () => {
    cy.visit("/");

    // Check for "Start Collecting" and "See Collection" buttons
    cy.contains("Start Collecting").should("be.visible");
    cy.contains("See Collection").should("be.visible");
  });

  it('should navigate to the collect page when clicking "Start Collecting"', () => {
    cy.visit("/");
    cy.contains("Start Collecting").click();
    cy.url().should("include", "/collect");
  });

  it('should navigate to the collection page when clicking "See Collection"', () => {
    cy.visit("/");
    cy.contains("See Collection").click();
    cy.url().should("include", "/collection");
  });
});
