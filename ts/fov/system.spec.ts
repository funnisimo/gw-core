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

            usesFov: jest.fn().mockReturnValue(true),
            fovChanged: jest.fn().mockReturnValue(true),

            eachViewport: jest.fn().mockImplementation((cb: FOV.ViewportCb) => {
                viewports.forEach((info) =>
                    cb(info.x, info.y, info.radius, info.type)
                );
            }),

            lightChanged: jest.fn().mockReturnValue(false),
            hasVisibleLight: jest.fn().mockReturnValue(true),

            blocksVision: jest.fn().mockReturnValue(false),

            cellRevealed: jest.fn(),
            redrawCell: jest.fn(),
            storeMemory: jest.fn(),
        };
        system = new FOV.FovSystem(site);
    });

    test('player only', () => {
        site.viewports.push({
            x: 10,
            y: 10,
            radius: 5,
            type: FOV.FovFlags.PLAYER,
        });

        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(5, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(4, 10)).toBeFalsy();
        expect(system.isDirectlyVisible(10, 5)).toBeTruthy();
        expect(system.isDirectlyVisible(10, 4)).toBeFalsy();
    });
});
