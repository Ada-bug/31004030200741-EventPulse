const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler', () => {
  test('calls the wrapped controller', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const controller = jest.fn();

    const wrapped = asyncHandler(controller);

    await wrapped(req, res, next);

    expect(controller).toHaveBeenCalledWith(req, res, next);
  });

  test('passes rejected errors to next', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const error = new Error('Test error');

    const controller = jest.fn().mockRejectedValue(error);

    const wrapped = asyncHandler(controller);

    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});