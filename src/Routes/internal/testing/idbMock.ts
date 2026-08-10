import { vi } from 'vitest';

export function setupIDBMock() {
    const mockStore = new Map<string, any>();
    let mockContainsStore = false;
    let mockOpenError = false;
    let mockGetError = false;
    let mockPutError = false;
    let mockDeleteError = false;
    let mockClearError = false;
    let mockAbortError = false;
    let mockQuotaError = false;

    const mockIDB = {
        open: vi.fn().mockImplementation(() => {
            const request: any = {
                result: {
                    objectStoreNames: {
                        contains: vi.fn().mockImplementation(() => mockContainsStore)
                    },
                    createObjectStore: vi.fn(),
                    transaction: vi.fn().mockImplementation((storeName: string, mode: string) => {
                        const tx: any = {
                            mode,
                            error: null,
                            oncomplete: null,
                            onabort: null,
                            onerror: null,
                            objectStore: vi.fn().mockReturnValue({
                                get: vi.fn((key: string) => {
                                    const req: any = {};
                                    setTimeout(() => {
                                        if (mockAbortError || mockQuotaError) {
                                            const err = mockQuotaError
                                                ? new DOMException('QuotaExceededError', 'QuotaExceededError')
                                                : new Error('IndexedDB transaction aborted');
                                            tx.error = err;
                                            if (tx.onabort) tx.onabort();
                                            if (tx.onerror) tx.onerror();
                                            return;
                                        }

                                        if (mockGetError) {
                                            req.error = new Error('get error');
                                            if (req.onerror) req.onerror();
                                        } else {
                                            req.result = mockStore.get(key);
                                            if (req.onsuccess) req.onsuccess();
                                            if (tx.oncomplete) tx.oncomplete();
                                        }
                                    }, 0);
                                    return req;
                                }),
                                put: vi.fn((entry: any) => {
                                    const req: any = {};
                                    setTimeout(() => {
                                        if (mockAbortError || mockQuotaError) {
                                            const err = mockQuotaError
                                                ? new DOMException('QuotaExceededError', 'QuotaExceededError')
                                                : new Error('IndexedDB transaction aborted');
                                            tx.error = err;
                                            if (tx.onabort) tx.onabort();
                                            if (tx.onerror) tx.onerror();
                                            return;
                                        }

                                        if (mockPutError) {
                                            req.error = new Error('put error');
                                            if (req.onerror) req.onerror();
                                        } else {
                                            mockStore.set(entry.key, entry);
                                            if (req.onsuccess) req.onsuccess();
                                            if (tx.oncomplete) tx.oncomplete();
                                        }
                                    }, 0);
                                    return req;
                                }),
                                delete: vi.fn((key: string) => {
                                    const req: any = {};
                                    setTimeout(() => {
                                        if (mockAbortError || mockQuotaError) {
                                            const err = mockQuotaError
                                                ? new DOMException('QuotaExceededError', 'QuotaExceededError')
                                                : new Error('IndexedDB transaction aborted');
                                            tx.error = err;
                                            if (tx.onabort) tx.onabort();
                                            if (tx.onerror) tx.onerror();
                                            return;
                                        }

                                        if (mockDeleteError) {
                                            req.error = new Error('delete error');
                                            if (req.onerror) req.onerror();
                                        } else {
                                            mockStore.delete(key);
                                            if (req.onsuccess) req.onsuccess();
                                            if (tx.oncomplete) tx.oncomplete();
                                        }
                                    }, 0);
                                    return req;
                                }),
                                clear: vi.fn(() => {
                                    const req: any = {};
                                    setTimeout(() => {
                                        if (mockAbortError || mockQuotaError) {
                                            const err = mockQuotaError
                                                ? new DOMException('QuotaExceededError', 'QuotaExceededError')
                                                : new Error('IndexedDB transaction aborted');
                                            tx.error = err;
                                            req.error = err;
                                            if (req.onerror) req.onerror();
                                            if (tx.onabort) tx.onabort();
                                            if (tx.onerror) tx.onerror();
                                            return;
                                        }

                                        if (mockClearError) {
                                            req.error = new Error('clear error');
                                            if (req.onerror) req.onerror();
                                        } else {
                                            mockStore.clear();
                                            if (req.onsuccess) req.onsuccess();
                                            if (tx.oncomplete) tx.oncomplete();
                                        }
                                    }, 0);
                                    return req;
                                })
                            })
                        };
                        return tx;
                    })
                }
            };
            setTimeout(() => {
                if (mockOpenError) {
                    request.error = new Error('open error');
                    if (request.onerror) request.onerror();
                } else {
                    if (request.onupgradeneeded) request.onupgradeneeded();
                    if (request.onsuccess) request.onsuccess();
                }
            }, 0);
            return request;
        })
    };

    global.indexedDB = mockIDB as any;

    return {
        mockStore,
        setContainsStore: (val: boolean) => { mockContainsStore = val; },
        setOpenError: (val: boolean) => { mockOpenError = val; },
        setGetError: (val: boolean) => { mockGetError = val; },
        setPutError: (val: boolean) => { mockPutError = val; },
        setDeleteError: (val: boolean) => { mockDeleteError = val; },
        setClearError: (val: boolean) => { mockClearError = val; },
        setAbortError: (val: boolean) => { mockAbortError = val; },
        setQuotaError: (val: boolean) => { mockQuotaError = val; },
        reset: () => {
            mockStore.clear();
            mockContainsStore = false;
            mockOpenError = false;
            mockGetError = false;
            mockPutError = false;
            mockDeleteError = false;
            mockClearError = false;
            mockAbortError = false;
            mockQuotaError = false;
            (mockIDB.open as any).mockClear();
        }
    };
}

