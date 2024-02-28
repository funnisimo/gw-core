import * as MSG from './message';

describe('message cache', () => {
    test('add', () => {
        const handler = new MSG.Cache();
        expect(handler.length).toEqual(0);
        handler.add('test');
        expect(handler.length).toEqual(1);
    });
});

describe('MessageManager', () => {
    test('basics', () => {
        const mgr = new MSG.MessageManager();

        expect(mgr.format('test', {})).toEqual('UNKNOWN MESSAGE: test');

        mgr.add('test', () => 'My cool message');
        expect(mgr.format('test', {})).toEqual('My cool message');

        mgr.add('test', (args) => `Message: ${args.name}`);
        expect(mgr.format('test', { name: 'Taco' })).toEqual('Message: Taco');
    });
});
