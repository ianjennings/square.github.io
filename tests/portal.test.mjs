import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("Square Open Source Portal", () => {
  it("loads the portal and shows the repo categories", async (context) => {
    const testdriver = TestDriver(context);

    // Launch Chrome against the live GitHub Pages site.
    await testdriver.provision.chrome({
      url: "https://square.github.io",
    });

    // Give the static page a moment to render.
    await testdriver.wait(2000);

    // The masthead heading should be visible.
    const headingVisible = await testdriver.assert(
      'the page shows the heading "Square Open Source"',
    );
    expect(headingVisible).toBeTruthy();

    // The portal groups repositories by language category. Confirm a few
    // of the category sections rendered.
    const categoriesVisible = await testdriver.assert(
      'the page lists open source project categories such as "Android", "Go", and "JavaScript"',
    );
    expect(categoriesVisible).toBeTruthy();

    // At least one repository entry should be present under a category.
    const repoVisible = await testdriver.assert(
      "at least one open source repository is listed on the page",
    );
    expect(repoVisible).toBeTruthy();
  });
});
