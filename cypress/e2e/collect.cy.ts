describe("Collect Flow", () => {
  it("should show the label selector on the collect page", () => {
    cy.visit("/collect");

    // The label selector should be visible initially as no label is selected
    cy.contains("Pilih Abjad").should("be.visible");

    // Check if some letters are present
    cy.contains("A").should("be.visible");
    cy.contains("B").should("be.visible");
    cy.contains("Z").should("be.visible");
  });

  it("should allow selecting a label and show the webcam section", () => {
    cy.visit("/collect");

    // Click on label 'A'
    cy.get('[data-testid="label-button-A"]').click();

    // The label selector should disappear and show the selected label
    cy.contains("HURUF: A").should("be.visible");

    // Check for Webcam related UI
    cy.contains("Mulai").should("be.visible");
  });
});
