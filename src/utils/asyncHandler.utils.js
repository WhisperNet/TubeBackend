const asyncHandler = fn => {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
}

export default asyncHandler;