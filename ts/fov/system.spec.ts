import * as FOV from './index';

interface ViewportInfo {
    x: number;
    y: number;
    radius: number;
    type: FOV.FovFlags;
}

interface TestFovSite extends FOV.FovSite {
    viewports: ViewportInfo[];
}

describe('FOV System', () => {
    let system: FOV.FovSystem;
    let site: TestFovSite;

    beforeEach(() => {
        const viewports: ViewportInfo[] = [];

        site = {
            width: 20,
            height: 20,

            viewports,

            // usesFov: jest.fn().mockReturnValue(true),
            // fovChanged: jest.fn().mockReturnValue(true),

            eachViewport: jest.fn().mockImplementation((cb: FOV.ViewportCb) => {
                viewports.forEach((info) =>
                    cb(info.x, info.y, info.radius, info.type)
                );
            }),

            lightingChanged: jest.fn().mockReturnValue(false),
            hasVisibleLight: jest.fn().mockReturnValue(true),

            blocksVision: jest.fn().mockReturnValue(false),

            onCellRevealed: jest.fn(),
            redrawCell: jest.fn(),
            storeMemory: jest.fn(),
        };
    });

    test('player only', () => {
        system = new FOV.FovSystem(site);

        site.viewports.push({
            x: 10,
            y: 10,
            radius: 5,
            type: FOV.FovFlags.PLAYER,
        });
        system.needsUpdate = true;

        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(5, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(4, 10)).toBeFalsy();
        expect(system.isDirectlyVisible(10, 5)).toBeTruthy();
        expect(system.isDirectlyVisible(10, 4)).toBeFalsy();
    });

    test('constructor - fov on', () => {
        system = new FOV.FovSystem(site, { fov: true });
        expect(system.isEnabled).toBeTruthy();
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeFalsy();
    });

    test('constructor - revealed', () => {
        system = new FOV.FovSystem(site, { revealed: true });

        // system.flags.dump((v) =>
        //     v & FOV.FovFlags.ANY_KIND_OF_VISIBLE ? '!' : ' '
        // );

        expect(system.isEnabled).toBeFalsy();
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeTruthy();
    });

    test('constructor - visible', () => {
        system = new FOV.FovSystem(site, { visible: true });
        expect(system.isEnabled).toBeFalsy();
        expect(system.isAnyKindOfVisible(5, 5)).toBeTruthy();
        expect(system.isVisible(5, 5)).toBeTruthy();
        expect(system.isDirectlyVisible(5, 5)).toBeFalsy(); // no FOV calculated
        expect(system.isRevealed(5, 5)).toBeTruthy();
    });

    test('constructor - not visible', () => {
        system = new FOV.FovSystem(site, { visible: false });
        expect(system.isEnabled).toBeTruthy();
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeFalsy();
    });
});
