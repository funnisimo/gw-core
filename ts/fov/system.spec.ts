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

            // onCellRevealed: jest.fn(),
            // redrawCell: jest.fn(),
            // storeMemory: jest.fn(),
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

    test('constructor - revealed', () => {
        const changeFn = jest.fn();

        system = new FOV.FovSystem(site, { revealed: true, onFovChange: changeFn });

        // system.flags.dump((v) =>
        //     v & FOV.FovFlags.ANY_KIND_OF_VISIBLE ? '!' : ' '
        // );

        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeTruthy();
    });

    test('constructor - visible', () => {
        const changeObj = { onFovChange: jest.fn() };
        system = new FOV.FovSystem(site, { visible: true, onFovChange: changeObj });
        expect(system.isAnyKindOfVisible(5, 5)).toBeTruthy();
        expect(system.isVisible(5, 5)).toBeTruthy();
        expect(system.isDirectlyVisible(5, 5)).toBeFalsy(); // no FOV calculated
        expect(system.isRevealed(5, 5)).toBeTruthy();
    });

    test('constructor - visible and not revealed', () => {
        system = new FOV.FovSystem(site, { visible: true, revealed: false });
        expect(system.isAnyKindOfVisible(5, 5)).toBeTruthy();
        expect(system.isVisible(5, 5)).toBeTruthy();
        expect(system.isDirectlyVisible(5, 5)).toBeFalsy(); // no FOV calculated
        expect(system.isRevealed(5, 5)).toBeFalsy(); // just visible, not revealed
    });

    test('constructor - not visible', () => {
        system = new FOV.FovSystem(site, { visible: false });
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeFalsy();
    });

    test('constructor - always visible', () => {
        system = new FOV.FovSystem(site, { alwaysVisible: true });
        expect(system.isAnyKindOfVisible(5, 5)).toBeTruthy();
        expect(system.isRevealed(5, 5)).toBeTruthy();
        expect(system.isInFov(5, 5)).toBeFalsy();
        expect(system.fovChanged(5, 5)).toBeTruthy();

        system.update(5, 5, 5);
        expect(system.isAnyKindOfVisible(5, 5)).toBeTruthy();
        expect(system.isRevealed(5, 5)).toBeTruthy();
        expect(system.isInFov(5, 5)).toBeTruthy();
        expect(system.fovChanged(5, 5)).toBeFalsy();    // visible -> visible

        expect(system.isAnyKindOfVisible(19, 19)).toBeTruthy();
        expect(system.isInFov(19, 10)).toBeFalsy();
        expect(system.fovChanged(19, 19)).toBeFalsy();  // not -> not

        expect(system.getFlag(19, 19) & FOV.FovFlags.ALWAYS_VISIBLE).toBeTruthy();
    });

    test('magic Mapped', () => {
        system = new FOV.FovSystem(site);
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeFalsy();
        expect(system.isInFov(5, 5)).toBeFalsy();
        expect(system.isMagicMapped(5, 5)).toBeFalsy();

        system.magicMapCell(5, 5);
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeFalsy();
        expect(system.isInFov(5, 5)).toBeFalsy();
        expect(system.isMagicMapped(5, 5)).toBeTruthy();
    });


    test('revealAll', () => {
        system = new FOV.FovSystem(site);
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeFalsy();

        system.revealAll();
        expect(system.isAnyKindOfVisible(5, 5)).toBeTruthy();
        expect(system.isRevealed(5, 5)).toBeTruthy();
    });

    test('cell functions', () => {
        system = new FOV.FovSystem(site);
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeFalsy();

        system.makeCellAlwaysVisible(5, 5);
        expect(system.isAnyKindOfVisible(5, 5)).toBeTruthy();
        expect(system.isRevealed(5, 5)).toBeTruthy();

        system.revealCell(6, 6);
        expect(system.isAnyKindOfVisible(6, 6)).toBeTruthy();
        expect(system.isRevealed(6, 6)).toBeTruthy();

        system.revealCell(7, 7, false);
        expect(system.isAnyKindOfVisible(7, 7)).toBeFalsy();
        expect(system.isRevealed(7, 7)).toBeTruthy();

        system.magicMapCell(8, 8);
        expect(system.isAnyKindOfVisible(8, 8)).toBeFalsy();
        expect(system.isRevealed(8, 8)).toBeFalsy();
        expect(system.isMagicMapped(8, 8)).toBeTruthy();

        system.hideCell(5, 5);
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeFalsy();

        system.hideCell(6, 6);
        expect(system.isAnyKindOfVisible(6, 6)).toBeFalsy();
        expect(system.isRevealed(6, 6)).toBeFalsy();

        system.hideCell(7, 7);
        expect(system.isAnyKindOfVisible(7, 7)).toBeFalsy();
        expect(system.isRevealed(7, 7)).toBeFalsy();

        system.hideCell(8, 8);
        expect(system.isAnyKindOfVisible(8, 8)).toBeFalsy();
        expect(system.isRevealed(8, 8)).toBeFalsy();
        expect(system.isMagicMapped(8, 8)).toBeFalsy();

    });

});
