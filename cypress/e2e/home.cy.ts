describe("Home Page", () => {
  it("should load the home page and show the main buttons", () => {
    cy.visit("/");

    // Check for "Mulai Ambil Data" and "Lihat Koleksi" buttons
    cy.contains("Mulai Ambil Data").should("be.visible");
    cy.contains("Lihat Koleksi").should("be.visible");
  });

  it('should navigate to the collect page when clicking "Mulai Ambil Data"', () => {
    cy.visit("/");
    cy.contains("Mulai Ambil Data").click();
    cy.url().should("include", "/collect");
  });

  it('should navigate to the collection page when clicking "Lihat Koleksi"', () => {
    cy.visit("/");
    cy.contains("Lihat Koleksi").click();
    cy.url().should("include", "/collection");
  });
});
