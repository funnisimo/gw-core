import * as Grid from "./grid";
import * as GW from "./index";

describe("GW.grid", () => {
  let a: Grid.NumGrid;

  afterEach(() => {
    GW.grid.free(a);
  });

  test("alloc/free", () => {
    a = GW.grid.alloc(10, 10, 0);
    expect(a.width).toEqual(10);
    expect(a.height).toEqual(10);
    expect(a[9][9]).toEqual(0);
    expect(a.hasXY(0, 0)).toBeTruthy();
  });

  test("realloc", () => {
    a = GW.grid.alloc(10, 10);
    a.fill(1);
    expect(a[0][0]).toEqual(1);
    GW.grid.free(a);

    const b = GW.grid.alloc(10, 10);
    expect(b).toBe(a);
    expect(b[0][0]).toEqual(0);
    GW.grid.free(b);
  });

  test("hasXY", () => {
    a = GW.grid.alloc(10, 10, 0);
    expect(a.hasXY(5, 5)).toBeTruthy();
    expect(a.hasXY(0, 0)).toBeTruthy();
    expect(a.hasXY(-1, 0)).toBeFalsy();
    expect(a.hasXY(0, -1)).toBeFalsy();
    expect(a.hasXY(9, 9)).toBeTruthy();
    expect(a.hasXY(10, 0)).toBeFalsy();
    expect(a.hasXY(0, 10)).toBeFalsy();
  });

  test("isBoundaryXY", () => {
    a = GW.grid.alloc(10, 10, 0);
    expect(a.isBoundaryXY(5, 5)).toBeFalsy();
    expect(a.isBoundaryXY(0, 0)).toBeTruthy();
    expect(a.isBoundaryXY(5, 0)).toBeTruthy();
    expect(a.isBoundaryXY(0, 5)).toBeTruthy();
    expect(a.isBoundaryXY(-1, 0)).toBeFalsy();
    expect(a.isBoundaryXY(0, -1)).toBeFalsy();
    expect(a.isBoundaryXY(9, 9)).toBeTruthy();
    expect(a.isBoundaryXY(5, 9)).toBeTruthy();
    expect(a.isBoundaryXY(9, 5)).toBeTruthy();
    expect(a.isBoundaryXY(10, 0)).toBeFalsy();
    expect(a.isBoundaryXY(0, 10)).toBeFalsy();
  });

  test("fill", () => {
    a = GW.grid.alloc(10, 10, 10);
    expect(a.count(0)).toEqual(0);
    a.fill(0);
    expect(a.count(0)).toEqual(100);
  });

  test("fillBlob", () => {
    a = GW.grid.alloc(80, 30, 0);
    expect(a.count(1)).toEqual(0);

    a.fillBlob(5, 4, 4, 30, 15, 55, "ffffftttt", "ffffttttt");
    expect(a.count(1)).toBeGreaterThan(10);
  });

  test("fillBlob - can handle min >= max", () => {
    GW.random.seed(123456);
    a = GW.grid.alloc(50, 30, 0);
    expect(a.count(1)).toEqual(0);

    a.fillBlob(5, 12, 12, 10, 10, 55, "ffffftttt", "ffffttttt");
    expect(a.count(1)).toBeGreaterThan(10);
  });

  test("floodFill", () => {
    a = GW.grid.alloc(20, 20, 0);
    a.fill(1);
    expect(a.count(1)).toEqual(400);
    a.floodFill(0, 0, 1, 2);
    expect(a.count(2)).toEqual(400);
  });
});
