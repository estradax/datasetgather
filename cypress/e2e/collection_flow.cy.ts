describe("Image Collection Flow", () => {
  beforeEach(() => {
    // Mock getMediaDevices/getUserMedia for webcam to avoid permission issues
    cy.visit("/collect", {
      onBeforeLoad(win) {
        // Mocking getUserMedia
        const mockStream = {
          getTracks: () => [{ stop: () => {}, kind: "video" }],
          getVideoTracks: () => [{ stop: () => {}, kind: "video" }],
          onremovetrack: null,
        };

        if (!win.navigator.mediaDevices) {
          (win.navigator as any).mediaDevices = {};
        }

        cy.stub(win.navigator.mediaDevices, "getUserMedia").resolves(
          mockStream,
        );

        const mockImage =
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWXFhZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKTVFVVlhZWmNkZWZnaGlqc3R1dnd4eXqGhc4uNWl4yJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxAPwA8Uf8AD8f/2Q==";

        // Set the mock image on window for the test hook in Collect page
        (win as any).__MOCK_IMAGE__ = mockImage;

        // Also mock toDataURL just in case
        cy.stub(win.HTMLCanvasElement.prototype, "toDataURL").returns(
          mockImage,
        );

        // Stub fetch to handle data URLs which might fail in some environments
        const originalFetch = win.fetch;
        cy.stub(win, "fetch").callsFake((url, ...args) => {
          if (typeof url === "string" && url.startsWith("data:")) {
            return Promise.resolve({
              ok: true,
              blob: () =>
                Promise.resolve(
                  new Blob(["mock-image-content"], { type: "image/jpeg" }),
                ),
            } as Response);
          }
          return originalFetch(url, ...args);
        });
      },
    });

    // Mock API calls
    cy.intercept("GET", "/api/collection/count", {
      statusCode: 200,
      body: [
        { letter: "A", count: 5 },
        { letter: "B", count: 0 },
      ],
    }).as("getCounts");

    cy.intercept("POST", "/api/upload", {
      statusCode: 200,
      body: { message: "File uploaded successfully", path: "A/mock-id.jpg" },
    }).as("uploadImage");
  });

  it("should allow selecting a label and starting collection with mocked Supabase", () => {
    // 1. Wait for counts to load
    cy.wait("@getCounts");
    cy.contains("Select Label").should("be.visible");

    // 2. Select label 'A'
    cy.contains("A").click();

    // 3. Verify page content
    cy.contains("Collecting for Class: A").should("be.visible");
    cy.contains("Start Collection").should("be.visible");

    // 4. Start collection
    cy.contains("Start Collection").click();

    // 5. Verify recording state
    cy.contains("Stop Collection").should("be.visible");
    cy.contains("RECORDING").should("be.visible");

    // 6. Wait for the upload call (happens after 3s countdown)
    cy.wait("@uploadImage", { timeout: 15000 });

    // 7. Verify the image appears in the gallery using data-testid
    cy.contains("1 items collected").should("be.visible");
    cy.get('[data-testid="image-card"]').should("have.length.at.least", 1);

    // 8. Stop collection
    cy.contains("Stop Collection").click();
    cy.contains("Start Collection").should("be.visible");
    cy.contains("IDLE").should("be.visible");
  });
});
