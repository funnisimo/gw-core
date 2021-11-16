import * as FOV from './index';
import * as UTILS from '../utils';

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

        const player = {
            x: 10,
            y: 10,
            radius: 5,
            type: FOV.FovFlags.PLAYER,
        };
        site.viewports.push(player);
        // system.needsUpdate = true;

        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(5, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(4, 10)).toBeFalsy();
        expect(system.isDirectlyVisible(10, 5)).toBeTruthy();
        expect(system.isDirectlyVisible(10, 4)).toBeFalsy();

        player.radius = 0; // blind
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(5, 10)).toBeFalsy();
        expect(system.wasAnyKindOfVisible(5, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(4, 10)).toBeFalsy();
        expect(system.wasAnyKindOfVisible(4, 10)).toBeFalsy();
        expect(system.isDirectlyVisible(10, 5)).toBeFalsy();
        expect(system.wasAnyKindOfVisible(10, 5)).toBeTruthy();
        expect(system.isDirectlyVisible(10, 4)).toBeFalsy();

        system.reset();
        expect(system.isRevealed(10, 10)).toBeFalsy();
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
    });

    test('follow player', () => {
        system = new FOV.FovSystem(site);

        const player = {
            x: 10,
            y: 10,
            visionDistance: 5,
            type: FOV.FovFlags.PLAYER,
        };
        system.follow = player;
        // system.needsUpdate = true;

        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(5, 10)).toBeTruthy();
        expect(system.isDirectlyVisible(4, 10)).toBeFalsy();
        expect(system.isDirectlyVisible(10, 5)).toBeTruthy();
        expect(system.isDirectlyVisible(10, 4)).toBeFalsy();
    });

    test('visible only', () => {
        system = new FOV.FovSystem(site);

        const viewport = {
            x: 10,
            y: 10,
            radius: 5,
            type: 0, // FovFlags.VISIBLE
        };
        site.viewports.push(viewport);
        // system.needsUpdate = true;

        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.isVisible(10, 10)).toBeTruthy();

        expect(system.isDirectlyVisible(5, 10)).toBeFalsy();
        expect(system.isVisible(5, 10)).toBeTruthy();

        expect(system.isVisible(4, 10)).toBeFalsy();
        expect(system.isVisible(10, 5)).toBeTruthy();
        expect(system.isVisible(10, 4)).toBeFalsy();

        system.reset();
        expect(system.isRevealed(10, 10)).toBeFalsy();
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
    });

    test('clairvoyant', () => {
        system = new FOV.FovSystem(site);

        const clairvoyant = {
            x: 10,
            y: 10,
            radius: 5,
            type: FOV.FovFlags.CLAIRVOYANT,
        };

        site.viewports.push(clairvoyant);
        // system.needsUpdate = true;

        expect(system.isDirectlyVisible(9, 9)).toBeFalsy();
        expect(system.isClairvoyantVisible(9, 9)).toBeFalsy();

        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(9, 9)).toBeFalsy();
        expect(system.isClairvoyantVisible(9, 9)).toBeTruthy();
        expect(system.isAnyKindOfVisible(9, 9)).toBeTruthy();

        expect(system.isClairvoyantVisible(5, 10)).toBeTruthy();
        expect(system.isAnyKindOfVisible(4, 10)).toBeFalsy();
        expect(system.isClairvoyantVisible(10, 5)).toBeTruthy();
        expect(system.isAnyKindOfVisible(10, 4)).toBeFalsy();

        clairvoyant.x = 15;
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(9, 9)).toBeFalsy();
        expect(system.isClairvoyantVisible(9, 9)).toBeFalsy();
        expect(system.isAnyKindOfVisible(9, 9)).toBeFalsy();
        expect(system.wasAnyKindOfVisible(9, 9)).toBeTruthy();

        expect(system.isDirectlyVisible(12, 12)).toBeFalsy();
        expect(system.isClairvoyantVisible(12, 12)).toBeTruthy();
        expect(system.isAnyKindOfVisible(12, 12)).toBeTruthy();

        system.reset();
        expect(system.isRevealed(10, 10)).toBeFalsy();
        expect(system.isClairvoyantVisible(12, 12)).toBeFalsy();
        expect(system.wasAnyKindOfVisible(12, 12)).toBeFalsy();
    });

    test('telepathic', () => {
        system = new FOV.FovSystem(site);

        const telepathic = {
            x: 10,
            y: 10,
            radius: 5,
            type: FOV.FovFlags.TELEPATHIC,
        };

        site.viewports.push(telepathic);
        // system.needsUpdate = true;

        expect(system.isDirectlyVisible(9, 9)).toBeFalsy();
        expect(system.isTelepathicVisible(9, 9)).toBeFalsy();

        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(9, 9)).toBeFalsy();
        expect(system.isTelepathicVisible(9, 9)).toBeTruthy();
        expect(system.isAnyKindOfVisible(9, 9)).toBeTruthy();

        expect(system.isTelepathicVisible(5, 10)).toBeTruthy();
        expect(system.isAnyKindOfVisible(4, 10)).toBeFalsy();
        expect(system.isTelepathicVisible(10, 5)).toBeTruthy();
        expect(system.isAnyKindOfVisible(10, 4)).toBeFalsy();

        telepathic.x = 15;
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(9, 9)).toBeFalsy();
        expect(system.isTelepathicVisible(9, 9)).toBeFalsy();
        expect(system.isAnyKindOfVisible(9, 9)).toBeFalsy();
        expect(system.wasAnyKindOfVisible(9, 9)).toBeTruthy();

        expect(system.isDirectlyVisible(12, 12)).toBeFalsy();
        expect(system.isTelepathicVisible(12, 12)).toBeTruthy();
        expect(system.isAnyKindOfVisible(12, 12)).toBeTruthy();

        system.reset();
        expect(system.isRevealed(10, 10)).toBeFalsy();
        expect(system.isTelepathicVisible(12, 12)).toBeFalsy();
        expect(system.wasAnyKindOfVisible(12, 12)).toBeFalsy();
    });

    test('constructor - revealed', () => {
        const changeFn = jest.fn();

        system = new FOV.FovSystem(site, {
            revealed: true,
            callback: changeFn,
        });

        // system.flags.dump((v) =>
        //     v & FOV.FovFlags.ANY_KIND_OF_VISIBLE ? '!' : ' '
        // );

        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeTruthy();
    });

    test('constructor - visible', () => {
        const changeObj = { onFovChange: jest.fn() };
        system = new FOV.FovSystem(site, {
            visible: true,
            callback: changeObj,
        });
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
        expect(system.fovChanged(5, 5)).toBeFalsy(); // visible -> visible

        expect(system.isAnyKindOfVisible(19, 19)).toBeTruthy();
        expect(system.isInFov(19, 10)).toBeFalsy();
        expect(system.fovChanged(19, 19)).toBeFalsy(); // not -> not

        expect(
            system.getFlag(19, 19) & FOV.FovFlags.ALWAYS_VISIBLE
        ).toBeTruthy();
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

    test('revealAll - not visible', () => {
        system = new FOV.FovSystem(site);
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
        expect(system.isRevealed(5, 5)).toBeFalsy();

        system.revealAll(false);
        expect(system.isAnyKindOfVisible(5, 5)).toBeFalsy();
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

    test('cursor', () => {
        system = new FOV.FovSystem(site);

        system.update(10, 10, 10);
        expect(system.isAnyKindOfVisible(7, 7)).toBeTruthy();

        system.setCursor(7, 7);
        expect(system.isCursor(7, 7)).toBeTruthy();
        expect(system.isCursor(8, 8)).toBeFalsy();

        system.update(5, 5, 5);

        system.setCursor(8, 8, true);
        expect(system.isCursor(7, 7)).toBeTruthy();
        expect(system.isCursor(8, 8)).toBeTruthy();

        system.update(15, 15, 5);

        system.clearCursor(7, 7);
        expect(system.isCursor(7, 7)).toBeFalsy();
        expect(system.isCursor(8, 8)).toBeTruthy();

        system.update(15, 15, 3);

        system.clearCursor();
        expect(system.isCursor(8, 8)).toBeFalsy();
    });

    test('highlight', () => {
        system = new FOV.FovSystem(site);

        system.update(10, 10, 10);
        expect(system.isAnyKindOfVisible(7, 7)).toBeTruthy();

        system.setHighlight(7, 7);
        expect(system.isHighlight(7, 7)).toBeTruthy();
        expect(system.isHighlight(8, 8)).toBeFalsy();

        system.update(5, 5, 5);

        system.setHighlight(8, 8, true);
        expect(system.isHighlight(7, 7)).toBeTruthy();
        expect(system.isHighlight(8, 8)).toBeTruthy();

        system.update(15, 15, 5);

        system.clearHighlight(7, 7);
        expect(system.isHighlight(7, 7)).toBeFalsy();
        expect(system.isHighlight(8, 8)).toBeTruthy();

        system.update(15, 15, 3);

        system.clearHighlight();
        expect(system.isHighlight(8, 8)).toBeFalsy();
    });

    test('callback', () => {
        system = new FOV.FovSystem(site);
        expect(system.callback).toBe(UTILS.NOOP);
        const fn = jest.fn();
        system.callback = fn;
        expect(system.callback).toBe(fn);
        system.callback = null;
        expect(system.callback).toBe(UTILS.NOOP);

        const obj = { onFovChange: fn };
        system.callback = obj;
        expect(system.callback).not.toBe(fn);
        system.callback(1, 2, true);
        expect(fn).toHaveBeenCalledWith(1, 2, true);
    });

    test('Actor detected', () => {
        system = new FOV.FovSystem(site);

        const actor = {
            x: 10,
            y: 10,
            radius: 0,
            type: FOV.FovFlags.ACTOR_DETECTED,
        };

        site.viewports.push(actor);
        // system.needsUpdate = true;

        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.isAnyKindOfVisible(10, 10)).toBeFalsy();
        expect(system.isActorDetected(10, 10)).toBeFalsy();

        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.isAnyKindOfVisible(10, 10)).toBeFalsy();
        expect(system.isActorDetected(10, 10)).toBeTruthy();
        expect(system.isActorDetected(11, 10)).toBeFalsy();
        expect(system.isActorDetected(10, 11)).toBeFalsy();

        actor.x = 15;
        actor.y = 15;
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.isAnyKindOfVisible(10, 10)).toBeFalsy();
        expect(system.isActorDetected(10, 10)).toBeFalsy();
        expect(system.isActorDetected(11, 10)).toBeFalsy();
        expect(system.isActorDetected(10, 11)).toBeFalsy();

        expect(system.isDirectlyVisible(15, 15)).toBeFalsy();
        expect(system.isAnyKindOfVisible(15, 15)).toBeFalsy();
        expect(system.isActorDetected(15, 15)).toBeTruthy();

        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.isAnyKindOfVisible(10, 10)).toBeFalsy();
        expect(system.isActorDetected(10, 10)).toBeFalsy();
        expect(system.isActorDetected(11, 10)).toBeFalsy();
        expect(system.isActorDetected(10, 11)).toBeFalsy();

        expect(system.isDirectlyVisible(15, 15)).toBeFalsy();
        expect(system.isAnyKindOfVisible(15, 15)).toBeFalsy();
        expect(system.isActorDetected(15, 15)).toBeTruthy();

        system.reset();
        expect(system.isDirectlyVisible(15, 15)).toBeFalsy();
        expect(system.isAnyKindOfVisible(15, 15)).toBeFalsy();
        expect(system.isActorDetected(15, 15)).toBeFalsy();
    });

    test('Item detected', () => {
        system = new FOV.FovSystem(site);

        const item = {
            x: 10,
            y: 10,
            radius: 0,
            type: FOV.FovFlags.ITEM_DETECTED,
        };

        site.viewports.push(item);
        // system.needsUpdate = true;

        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.isAnyKindOfVisible(10, 10)).toBeFalsy();
        expect(system.isItemDetected(10, 10)).toBeFalsy();

        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.isAnyKindOfVisible(10, 10)).toBeFalsy();
        expect(system.isItemDetected(10, 10)).toBeTruthy();
        expect(system.isItemDetected(11, 10)).toBeFalsy();
        expect(system.isItemDetected(10, 11)).toBeFalsy();

        item.x = 15;
        item.y = 15;
        expect(system.update()).toBeTruthy();
        expect(system.isDirectlyVisible(10, 10)).toBeFalsy();
        expect(system.isAnyKindOfVisible(10, 10)).toBeFalsy();
        expect(system.isItemDetected(10, 10)).toBeFalsy();
        expect(system.isItemDetected(11, 10)).toBeFalsy();
        expect(system.isItemDetected(10, 11)).toBeFalsy();

        expect(system.isDirectlyVisible(15, 15)).toBeFalsy();
        expect(system.isAnyKindOfVisible(15, 15)).toBeFalsy();
        expect(system.isItemDetected(15, 15)).toBeTruthy();

        system.reset();
        expect(system.isDirectlyVisible(15, 15)).toBeFalsy();
        expect(system.isAnyKindOfVisible(15, 15)).toBeFalsy();
        expect(system.isItemDetected(15, 15)).toBeFalsy();
    });

    test('out of bounds', () => {
        system = new FOV.FovSystem(site);
        expect(system.fovChanged(-1, -1)).toBeFalsy();
    });
});
